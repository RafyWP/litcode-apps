
import { get } from "@vercel/edge-config";
import AlinkProClient from "./alink-pro-client";

export default async function AlinkProPage() {
  let emailFromConfig: string | undefined;
  let phoneFromConfig: string | undefined;

  try {
    // Fetch email and phone from Vercel Edge Config
    emailFromConfig = await get<string>('userTestEmail');
    phoneFromConfig = await get<string>('userTestPhone');
  } catch (error) {
    // Fail gracefully if Edge Config is not available, defaults will be used in the client
  }

  return (
    <AlinkProClient
      emailFromConfig={emailFromConfig}
      phoneFromConfig={phoneFromConfig}
    />
  );
}
