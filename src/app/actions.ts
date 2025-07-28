
"use server";

import { get } from "@vercel/edge-config";
import { z } from "zod";

const getAccessTokenSchema = z.object({
  authCode: z.string().min(1, "Authorization Code is required."),
});

export async function getAccessToken(
  params: z.infer<typeof getAccessTokenSchema>
) {
  try {
    const validatedParams = getAccessTokenSchema.parse(params);
    const { authCode } = validatedParams;

    const appId = process.env.TIKTOK_APP_ID;
    const secret = process.env.TIKTOK_SECRET;

    if (!appId || !secret) {
      return {
        success: false,
        error:
          "App ID or Secret is not configured in server environment variables.",
      };
    }

    const response = await fetch(
      "https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          app_id: appId,
          secret: secret,
          auth_code: authCode,
        }),
      }
    );

    const data = await response.json();

    if (data.code !== 0) {
      return {
        success: false,
        error: data.message || "Failed to retrieve access token.",
      };
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

const getAdvertisersSchema = z.object({
  accessToken: z.string().min(1, "Access Token is required."),
});

export async function getAdvertisers(
  params: z.infer<typeof getAdvertisersSchema>
) {
  try {
    const validatedParams = getAdvertisersSchema.parse(params);
    const { accessToken } = validatedParams;
    const appId = process.env.TIKTOK_APP_ID;
    const secret = process.env.TIKTOK_SECRET;

    if (!appId || !secret) {
      return {
        success: false,
        error:
          "App ID or Secret is not configured in server environment variables.",
      };
    }

    const urlParams = new URLSearchParams({
      app_id: appId,
      secret: secret,
      fields: '["advertiser_id", "advertiser_name"]',
    });

    const response = await fetch(
      `https://business-api.tiktok.com/open_api/v1.3/oauth2/advertiser/get/?${urlParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Access-Token": accessToken,
        },
      }
    );

    const data = await response.json();

    if (data.code !== 0) {
      return {
        success: false,
        error: data.message || "Failed to fetch advertisers.",
      };
    }

    return { success: true, data: data.data.list };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(" "),
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred while fetching advertisers.",
    };
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
      return {
        success: false,
        error: data.message || "Failed to create pixel.",
      };
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

const trackEventSchema = z.object({
  accessToken: z.string(),
  pixelCode: z.string(),
});

export async function trackEvent(params: z.infer<typeof trackEventSchema>) {
  try {
    const validatedParams = trackEventSchema.parse(params);
    const { accessToken, pixelCode } = validatedParams;

    const eventName = "Purchase";
    const eventTime = Math.floor(new Date().getTime() / 1000);
    const eventId = `${eventName.toLowerCase()}_${eventTime}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const requestBody = {
      event_source: "web",
      event_source_id: pixelCode,
      data: [
        {
          event: eventName,
          event_time: eventTime,
          event_id: eventId,
        },
      ],
    };

    const response = await fetch(
      "https://business-api.tiktok.com/open_api/v1.3/event/track/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Token": accessToken,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

    if (data.code !== 0) {
      return {
        success: false,
        error: data.message || "Failed to track event.",
        details: data,
        requestPayload: requestBody,
      };
    }

    return {
      success: true,
      data: data,
      requestPayload: requestBody,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(" "),
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred while tracking the event.",
    };
  }
}

const verifyEmailSchema = z.object({
  email: z.string().min(1, "Please enter a valid email or bypass code."),
});

export async function verifyEmail(params: z.infer<typeof verifyEmailSchema>) {
  try {
    const validatedParams = verifyEmailSchema.parse(params);
    const { email } = validatedParams;

    // 1. Check for bypass code
    let bypassCode: string | undefined;
    try {
      bypassCode = await get<string>('mailByPassTTVA');
    } catch {
      // Edge Config not available, try env var
    }
    
    if (!bypassCode) {
      bypassCode = process.env.MAIL_BYPASS_TTVA;
    }

    if (bypassCode && email === bypassCode) {
      return { success: true, isBypass: true };
    }

    // 2. If not bypass, check against allowed emails list
    const allowedEmailsStr = await get<string>('allowedEmails');

    if (!allowedEmailsStr) {
      return {
        success: false,
        error: "Email list is not configured. Please contact support.",
      };
    }

    const allowedEmails = allowedEmailsStr.split(',').map(e => e.trim().toLowerCase());
    
    // Validate if the input is a proper email before checking the list
    const emailValidation = z.string().email().safeParse(email);
    if (!emailValidation.success) {
      return { success: false, error: "This email is not authorized." };
    }


    if (allowedEmails.includes(email.toLowerCase())) {
      return { success: true };
    } else {
      return { success: false, error: "This email is not authorized." };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(" "),
      };
    }
    return {
      success: false,
      error: "Could not verify email. The allowed list might not be set up in Vercel Edge Config.",
    };
  }
}
