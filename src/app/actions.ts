
"use server";

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

    const appId = process.env.NEXT_PUBLIC_TIKTOK_APP_ID;
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
    const appId = process.env.NEXT_PUBLIC_TIKTOK_APP_ID;
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
  pixelId: z.string(),
  event: z.string(),
  value: z.number(),
  currency: z.string(),
  contentId: z.string(),
  contentName: z.string(),
});

export async function trackEvent(params: z.infer<typeof trackEventSchema>) {
    try {
        const validatedParams = trackEventSchema.parse(params);
        const {
            accessToken,
            pixelId,
            event,
            value,
            currency,
            contentId,
            contentName
        } = validatedParams;

        // Using a timestamp in seconds
        const eventTime = Math.floor(new Date().getTime() / 1000);

        const response = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Token": accessToken,
            },
            body: JSON.stringify({
                "event_source": "web",
                "event_source_id": pixelId,
                "data": [{
                    "event": event,
                    "event_time": eventTime,
                    "event_id": `${event.toLowerCase()}_${eventTime}_${Math.random().toString(36).substring(2, 9)}`,
                    "user": {
                        "external_id": "c4ca4238a0b923820dcc509a6f75849b", // SHA256 of "1"
                        "phone": "257b4f2b18a595c52402ba69130545931de61346f041e1713532a24534f31835", // SHA256 of "1112223333"
                        "email": "123456405862e402eb76a70f8a26fc732d07c32931e9fae9ab1582911d2e8a3b", // SHA256 of test@example.com
                        "ip": "127.0.0.1",
                        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                        "locale": "en_US"
                    },
                    "properties": {
                        "currency": currency,
                        "value": value,
                        "content_type": "product",
                        "contents": [{
                            "price": value,
                            "quantity": 1,
                            "content_id": contentId,
                            "content_name": contentName
                        }]
                    }
                }]
            })
        });

        const data = await response.json();

        if (data.code !== 0) {
            return {
                success: false,
                error: data.message || "Failed to track event.",
                details: data
            };
        }

        return {
            success: true,
            data: data.data
        };

    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors.map((e) => e.message).join(" "),
            };
        }
        console.error(error);
        return {
            success: false,
            error: "An unexpected error occurred while tracking the event."
        };
    }
}
