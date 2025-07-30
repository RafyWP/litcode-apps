
"use server";

import { get } from "@vercel/edge-config";
import { z } from "zod";
import { createHmac, createHash } from "crypto";

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
  externalId: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

function hashValue(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function trackEvent(params: z.infer<typeof trackEventSchema>) {
  try {
    const validatedParams = trackEventSchema.parse(params);
    const { accessToken, pixelCode, externalId, email, phone } = validatedParams;

    const eventName = "Purchase";
    const eventTime = Math.floor(new Date().getTime() / 1000);
    
    // As per TikTok docs, email/phone must be hashed. external_id is not specified to be hashed.
    const userObject = {
        email: email ? hashValue(email) : undefined,
        phone: phone ? hashValue(phone) : undefined,
        external_id: externalId || undefined,
        ttclid: null,
        ip: null,
        user_agent: null,
    };

    // Remove undefined keys from user object
    Object.keys(userObject).forEach(key => userObject[key as keyof typeof userObject] === undefined && delete userObject[key as keyof typeof userObject]);


    const requestBody = {
      event_source: "web",
      event_source_id: pixelCode,
      data: [
        {
          event: eventName,
          event_time: eventTime,
          user: userObject,
          properties: {
            contents: [
              {
                content_id: "123",
                content_name: "Test Product",
              },
            ],
            currency: "USD",
            value: 0,
            content_type: "product",
            description: "This record is intended to test the pixel.",
          },
          page: {
            url: "https://ia.litcode.store/produto/test-product",
            referrer: "123",
          },
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

    let bypassCode: string | undefined;
    try {
      bypassCode = await get<string>('mailByPassTTVA');
    } catch {
      // Edge Config not available, try env var.
      bypassCode = process.env.MAIL_BYPASS_TTVA;
    }

    if (bypassCode && email === bypassCode) {
      return { success: true, isBypass: true };
    }

    const allowedEmailsStr = await get<string>('allowedEmails');

    if (!allowedEmailsStr) {
      return {
        success: false,
        error: "Email list is not configured. Please contact support.",
      };
    }

    const allowedEmails = allowedEmailsStr.split(',').map(e => e.trim().toLowerCase());
    
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

// --- Hotmart API ---

let hotmartAccessToken: string | null = null;
let hotmartTokenExpiresAt: number = 0;

async function getHotmartToken() {
  const now = Date.now();
  if (hotmartAccessToken && now < hotmartTokenExpiresAt) {
    return hotmartAccessToken;
  }
  
  const authUrl = "https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials";
  const basicToken = "Basic YTI3MTgzYzItOWQ0Mi00ZDJlLWJiOTUtOGUxMjZmMzBiMjhmOjMzYmZiYmI2LTViYTctNGQ5OC04NjdlLTk3MTNkMWQ1Y2QzOA==";

  const response = await fetch(authUrl, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': basicToken
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to get Hotmart token: ${errorData.error_description || response.statusText}`);
  }

  const data = await response.json();
  hotmartAccessToken = data.access_token;
  // expires_in is in seconds. Convert to milliseconds and leave a 60-second buffer.
  hotmartTokenExpiresAt = now + (data.expires_in - 60) * 1000;
  
  return hotmartAccessToken;
}


const getHotmartProductSchema = z.object({
  productId: z.string().min(1, "Product ID is required."),
});

export async function getHotmartProduct(params: z.infer<typeof getHotmartProductSchema>) {
  try {
    const validatedParams = getHotmartProductSchema.parse(params);
    const { productId } = validatedParams;
    const accessToken = await getHotmartToken();

    const productApiUrl = `https://developers.hotmart.com/payments/api/v1/products?productId=${productId}`;

    const response = await fetch(productApiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Failed to fetch product from Hotmart: ${errorText}` };
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return { success: true, data: data.items[0] };
    } else {
      return { success: false, error: "Product not found on Hotmart." };
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(" "),
      };
    }
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: errorMessage };
  }
}
