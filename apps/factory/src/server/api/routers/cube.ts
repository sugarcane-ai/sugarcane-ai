import {
  createTRPCRouter,
  promptMiddleware,
  publicProcedure,
} from "~/server/api/trpc";
import { getPromptInput, getPromptOutput } from "~/validators/service";
import { getLogInput, logOutput } from "~/validators/prompt_log";
import { getPv } from "./service";

export const cubeRouter = createTRPCRouter({
  getPrompt: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/{username}/{package}/{template}/{versionOrEnvironment}",
        tags: ["prompts"],
        summary: "Get Prompt Template",
      },
    })
    .input(getPromptInput)
    .use(promptMiddleware)
    .output(getPromptOutput)
    .query(async ({ ctx, input }) => {
      console.info(`Prompt get ----------------- ${JSON.stringify(input)}`);
      const [pv, pt] = await getPv(ctx, input);
      // console.log(
      //   "pt-------------------------------------------------------------->",
      //   pt,
      // );
      if (pv) {
        console.info(`Prompt generating output ${JSON.stringify(pv)}`);
        return {
          template: pv.template,
          version: pv.version,
          createdAt: pv.createdAt,
          updatedAt: pv.updatedAt,
          description: pt?.description,
          modelType: pv.llmModelType,
          promptPackageId: pt.promptPackageId,
          templateId: pt.id,
        };
      }
      return null;
    }),

  getPromptLogOutput: publicProcedure
    .input(getLogInput)
    .output(logOutput)
    .query(async ({ ctx, input }) => {
      const { id } = input;
      console.log(id);
      let query = {
        id: id,
      };

      const log = await ctx.prisma.promptLog.findFirst({
        where: query,
      });

      return log;
    }),
});
