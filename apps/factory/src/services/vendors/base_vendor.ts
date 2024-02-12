import { GPTResponseType } from "~/validators/openaiResponse";
import { fakeResponse } from "../llm_response/fake_response";
import { logLLMResponse, truncateObj } from "~/utils/log";

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
): Promise<{ data: any; error: null } | { data: null; error: any }> {
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
        errorHandling({
          code: response.status,
          message: response.statusText,
          vendorCode: response.status,
          vendorMessage: response.statusText,
        });
      }
    } catch (error: any) {
      console.error(`Request failed: ${url}`, error);
      errorHandling(error);
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

export interface ErrorResponse {
  code: string | null | number;
  message: string | null;
  vendorCode: string | null | number;
  vendorMessage: string | null;
}

export function errorHandling({
  code,
  message,
  vendorCode,
  vendorMessage,
}: ErrorResponse) {
  if (vendorCode) {
    if (vendorCode && /^[4]/.test(vendorCode.toString())) {
      const clientError = {
        code: "CLIENT_ERROR",
        message: "Client error occurred.",
        vendorCode,
        vendorMessage: vendorMessage || "Unknown client error.",
      };
      throw clientError;
    } else if (vendorCode && /^[5]/.test(vendorCode.toString())) {
      const serverError = {
        code: "SERVER_ERROR",
        message: "Server error occurred.",
        vendorCode,
        vendorMessage: vendorMessage || "Unknown server error.",
      };
      throw serverError;
    } else if (vendorCode === null) {
      const internalError = {
        code: "INTERNAL_ERROR",
        message: "Internal server error occurred.",
        vendorCode: null,
        vendorMessage: null,
      };
      throw internalError;
    }
  }

  return { code, message, vendorCode, vendorMessage };
}

export default BaseVendor;
