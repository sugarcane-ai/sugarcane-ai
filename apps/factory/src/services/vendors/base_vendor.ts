import { GPTResponseType } from "~/validators/openaiResponse";
import { fakeResponse } from "../llm_response/fake_response";
import { logLLMResponse, truncateObj } from "~/utils/log";
import { errorHandling, ErrorResponse } from "./error_handling";

class BaseVendor {
  private endpoint: string;
  private maxRetries: number;
  private retryDelay: number;

  constructor(
    endpoint: string,
    maxRetries: number = 1,
    retryDelay: number = 1000,
  ) {
    this.endpoint = endpoint;
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  protected getUrl(): string {
    return this.endpoint;
  }

  protected createHeaders(): Headers {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    return myHeaders;
  }

  protected createRequestOptions(prompt: string): RequestInit {
    const formdata = new FormData();
    formdata.append("prompt", `${prompt}`);

    return {
      method: "POST",
      headers: this.createHeaders(),
      body: formdata,
      redirect: "follow",
    };
  }

  protected createFakeResponse() {
    throw "To be implemented";
  }

  async makeApiCallWithRetry(
    prompt: string,
    dryRun: boolean,
  ): Promise<{ response: Response | null; latency: number }> {
    const requestOptions = this.createRequestOptions(prompt);
    const startTime = new Date();

    let response;
    if (!dryRun) {
      console.log(this.getUrl(), JSON.stringify(requestOptions));
      const fetchResult = await fetchWithRetry(
        this.getUrl(),
        requestOptions,
        this.maxRetries,
        this.retryDelay,
      );

      if (fetchResult.data !== null) {
        response = fetchResult.data;
      }
    } else {
      response = this.createFakeResponse();
    }

    const endTime = new Date();
    const latency: number = endTime.getTime() - startTime.getTime();

    logLLMResponse(this.constructor.name, response);

    return { response, latency };
  }
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number,
  retryDelay: number,
): Promise<{ data: any | null; error: ErrorResponse | null }> {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return { data: await response.json(), error: null };
      } else {
        console.error(
          `Status ${response.status} ${response.statusText}: ${JSON.stringify(
            await truncateObj(response.text()),
          )}`,
        );
        const errorResponse: ErrorResponse = {
          code: response.status,
          message: response.statusText,
          vendorCode: response.status,
          vendorMessage: response.statusText,
        };
        errorHandling(errorResponse);
        return { data: null, error: errorResponse };
      }
    } catch (error: any) {
      console.error(`Request failed: ${url}`, error);
      errorHandling(error as ErrorResponse);
    }

    retryCount++;
    if (retryCount < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  // Return a special case if maximum retries are reached
  return {
    data: null,
    error: null,
  };
}

export default BaseVendor;
