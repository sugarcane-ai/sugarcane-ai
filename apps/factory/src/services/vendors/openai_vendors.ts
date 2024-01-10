import BaseVendor from "~/services/vendors/base_vendor";
import { fakeResponse } from "~/services/llm_response/fake_response";
import {
  LlmConfigSchema,
  PromptJsonDataType,
} from "~/validators/prompt_version";
import OpenAI from "openai";
import { env } from "~/env.mjs";
import {
  ModelTypeType,
  ModelTypeSchema,
} from "~/generated/prisma-client-zod.ts";

class OpenAIVendor extends BaseVendor {
  private openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  private provider: string;
  private model: string;
  private llmConfig: LlmConfigSchema;

  constructor(
    provider: string,
    model: string,
    llmConfig: LlmConfigSchema,
    maxRetries = 3,
    retryDelay = 1000,
  ) {
    super("https://api.openai.com/v1/chat/completions", maxRetries, retryDelay);
    this.provider = provider;
    this.model = model;
    this.llmConfig = llmConfig;
  }

  protected createHeaders(): Headers {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${process.env.OPENAI_API_KEY}`);
    return myHeaders;
  }

  protected createFakeResponse() {
    const allowedModels = ["gpt-3.5-turbo", "gpt-4"];
    if (allowedModels.includes(this.model)) {
      return fakeResponse.openAIFakeResponse;
    } else {
      throw `Not implemented for ${this.provider}/${this.model}`;
    }
  }

  protected createRequestOptions(prompt: string): RequestInit {
    return {
      method: "POST",
      headers: this.createHeaders(),
      body: JSON.stringify({
        model: `${this.model}`,
        messages: [
          ...JSON.parse(prompt).map((item: PromptJsonDataType) => {
            return {
              role: item.role,
              content: item.content,
            };
          }),
        ],
        temperature: this.llmConfig.temperature,
        max_tokens: this.llmConfig.maxTokens,
        top_p: this.llmConfig.topP,
        frequency_penalty: this.llmConfig.freqPenalty,
        presence_penalty: this.llmConfig.presencePenalty,
        stop: ['"""'],
      }),
    };
  }

  protected createnewResponse(response: any) {
    const newResponse = fakeResponse.openAIFakeResponse;
    newResponse.id = response.id;
    newResponse.object = response.id;
    newResponse.created = response.id;
    newResponse.model = response.id;
    newResponse.choices = [
      {
        index: 0,
        text: response.choices[0]?.message.content,
        logprobs: null,
        finish_reason: "stop",
      },
    ];
    newResponse.usage = response.usage;
    newResponse.system_fingerprint = response.system_fingerprint;
    return newResponse;
  }

  protected async executeTEXT_TO_TEXTModel(prompt: string, dryRun: boolean) {
    if (dryRun) {
      return this.createFakeResponse();
    }

    const response = await this.openai.chat.completions.create({
      messages: [
        ...JSON.parse(prompt).map(
          (item: { id: string; role: string; content: string }) => {
            return {
              role: item.role,
              content: item.content,
            };
          },
        ),
      ],
      model: this.model,
    });
    const newResponse = this.createnewResponse(response);
    return newResponse;
  }
  protected async executeTEXT_TO_IMAGEModel(prompt: string, dryRun: boolean) {
    if (dryRun) {
      let response = {
        created: "",
        data: [
          {
            revised_prompt: prompt,
            url: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-EtszQGOwBjuTHl0KBLpY3i5m/user-NXHbJDw87weLt2F0XIpbqqYe/img-iqSyGvpqA9SnhRZt5gNDXEbp.png?st=2024-01-03T04%3A10%3A00Z&se=2024-01-03T06%3A10%3A00Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-02T18%3A09%3A25Z&ske=2024-01-03T18%3A09%3A25Z&sks=b&skv=2021-08-06&sig=VJDkwRKRI95%2B63nx9teiQVjedt8yYeRHytlROtPmUPM%3D",
          },
        ],
      };
      return response;
    }

    const response = await this.openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    return response;
    // size: this.model === "dall-e-2" ? "512x512" : "1024x1024",
  }

  async main(prompt: string, llmModelType: ModelTypeType, dryRun: boolean) {
    try {
      if (llmModelType === ModelTypeSchema.Enum.TEXT2TEXT) {
        return this.executeTEXT_TO_TEXTModel(prompt, dryRun);
      } else {
        return this.executeTEXT_TO_IMAGEModel(prompt, dryRun);
      }
    } catch (error) {
      console.error("OpenAI API request failed:", error);
      // Provide a default response or handle the error as needed
      return this.createFakeResponse();
    }
  }
}

export default OpenAIVendor;
