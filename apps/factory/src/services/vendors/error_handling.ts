export interface ErrorResponse {
  code: string | null | number;
  message: string | null;
  vendorCode: string | null | number;
  vendorMessage: string | null;
}

type ErrorMessagesType = {
  CLIENT_ERROR: (
    vendorCode: string | number | null,
    vendorMessage: string | null,
  ) => ErrorResponse;
  SERVER_ERROR: (
    vendorCode: string | number | null,
    vendorMessage: string | null,
  ) => ErrorResponse;
  INTERNAL_ERROR: (
    vendorCode: string | number | null,
    vendorMessage: string | null,
  ) => ErrorResponse;
};

// Define a global object for error codes and messages
const ErrorMessages: ErrorMessagesType = {
  CLIENT_ERROR: (vendorCode, vendorMessage) => ({
    code: "CLIENT_ERROR",
    message: "Client error occurred.",
    vendorCode,
    vendorMessage: vendorMessage || "Unknown client error.",
  }),
  SERVER_ERROR: (vendorCode, vendorMessage) => ({
    code: "SERVER_ERROR",
    message: "Server error occurred.",
    vendorCode,
    vendorMessage: vendorMessage || "Unknown server error.",
  }),
  INTERNAL_ERROR: (vendorCode, vendorMessage) => ({
    code: "INTERNAL_ERROR",
    message: "Internal server error occurred.",
    vendorCode: vendorCode || null,
    vendorMessage: vendorMessage || null,
  }),
};

export function errorHandling({
  code,
  message,
  vendorCode,
  vendorMessage,
}: ErrorResponse) {
  if (vendorCode) {
    if (vendorCode && /^[4]/.test(vendorCode.toString())) {
      throw ErrorMessages.CLIENT_ERROR(vendorCode, vendorMessage);
    } else if (vendorCode && /^[5]/.test(vendorCode.toString())) {
      throw ErrorMessages.SERVER_ERROR(vendorCode, vendorMessage);
    } else if (vendorCode === null) {
      throw ErrorMessages.INTERNAL_ERROR(vendorCode, vendorMessage);
    }
  }

  return { code, message, vendorCode, vendorMessage };
}
