"use server";

import { z } from "zod";

const getAccessTokenSchema = z.object({
  clientKey: z.string().min(1, "Client Key is required."),
  clientSecret: z.string().min(1, "Client Secret is required."),
  authCode: z.string().min(1, "Authorization Code is required."),
  redirectUri: z.string().url("Invalid Redirect URI."),
});

export async function getAccessToken(
  params: z.infer<typeof getAccessTokenSchema>
) {
  try {
    const validatedParams = getAccessTokenSchema.parse(params);
    const { clientKey, clientSecret, authCode, redirectUri } = validatedParams;

    const response = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code: authCode,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error_description || "Failed to retrieve access token.",
      };
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(" "),
      };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}

const createPixelSchema = z.object({
  accessToken: z.string().min(1, "Access Token is required."),
  advertiserId: z.string().min(1, "Advertiser ID is required."),
  pixelName: z.string().min(1, "Pixel Name is required."),
});

export async function createPixel(params: z.infer<typeof createPixelSchema>) {
  try {
    const validatedParams = createPixelSchema.parse(params);
    const { accessToken, advertiserId, pixelName } = validatedParams;

    const response = await fetch(
      "https://business-api.tiktok.com/open_api/v1.3/pixel/create/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Token": accessToken,
        },
        body: JSON.stringify({
          pixel_name: pixelName,
          advertiser_id: advertiserId,
        }),
      }
    );

    const data = await response.json();

    if (data.code !== 0) {
      return { success: false, error: data.message || "Failed to create pixel." };
    }

    return { success: true, data: data.data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(" "),
      };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}
