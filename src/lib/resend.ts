import { Resend } from "resend";

function createResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set. Email functionality will be disabled.");
    return null;
  }
  return new Resend(apiKey);
}

export const resend = createResendClient();
