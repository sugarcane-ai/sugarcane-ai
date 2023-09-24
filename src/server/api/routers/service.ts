import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateInput, generateOutput } from "~/validators/service";
import { run } from "~/services/openai";
import { JsonObject } from "@prisma/client/runtime/library";
import { generateLLmConfig, generatePrompt } from "~/utils/template";
import { promptEnvironment } from "~/validators/base";

export const serviceRouter = createTRPCRouter({
  generate: publicProcedure
      .meta({
        openapi: {
          method: 'POST',
          path: '/generate',
          tags: ['prompts'],
          summary: 'Prompt As A Service',
        },
      })
    .input(generateInput)
    .output(generateOutput)
    .mutation(async ({ ctx, input }) => {
      let pt = null;
      let pv = null;

      const userId = input.userId || ctx.session?.user.id
      
      if (input.version) {
        pv = await ctx.prisma.promptVersion.findFirst({
          where: {
            userId: userId,
            promptPackageId: input.promptPackageId,
            promptTemplateId: input.promptTemplateId,
            version: input.version,
          },
        });
      } else {
        
        const ptd = {
          userId: userId,
          promptPackageId: input.promptPackageId,
          id: input.promptTemplateId,
        }
        
        console.info(`finding the ${input.environment} version ${JSON.stringify(ptd)}`)
        pt = await ctx.prisma.promptTemplate.findFirst({
          where: ptd,
          include:{
            previewVersion: true, 
            releaseVersion: true,
          }
        });
        pv = (input.environment == promptEnvironment.Enum.RELEASE) ? pt?.releaseVersion : pt?.previewVersion
      }

      

      console.log(`promptVersion >>>> ${JSON.stringify(pv)}`);
      if (pv) {
        console.log(`data >>>> ${JSON.stringify(input)}`);
        const prompt = generatePrompt(pv.template, input.data);
        console.log(`prompt >>>> ${prompt}`);
        // Todo: Load a provider on the fly
        const llmConfig = generateLLmConfig(pv.llmConfig as JsonObject)
        const output = await run(
          prompt,
          pv.llmModel,
          llmConfig
        );
        

        console.log(`output -------------- ${JSON.stringify(output)}`);
        // const pl = await createPromptLog(ctx, pv, prompt, output);

        const pl = await ctx.prisma.promptLog.create({
          data: {
            promptPackageId: pv.promptPackageId,
            promptTemplateId: pv.promptTemplateId,
            promptVersionId: pv.id,

            environment: input.environment,
            
            version: pv.version,
            prompt: prompt,
            completion: output?.completion as string,
      
            llmProvider: pv.llmProvider,
            llmModel: pv.llmModel,
            llmConfig: llmConfig as JsonObject,
            
            latency: output?.performance?.latency as number,
            prompt_tokens: output?.performance?.prompt_tokens as number,
            completion_tokens: output?.performance?.completion_tokens as number || 0,
            total_tokens: output?.performance?.total_tokens as number,
            extras: {},
          },
        });

        return pl;
      } else {
        console.error(`promptVersion not found >>>> ${JSON.stringify(input)}`);
      }

      return null;
    }),
});