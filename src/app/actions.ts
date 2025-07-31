
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
          "App ID ou Secret não está configurado nas variáveis de ambiente do servidor.",
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
        error: data.message || "Falha ao obter o token de acesso.",
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
    return { success: false, error: "Ocorreu um erro inesperado." };
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
          "App ID ou Secret não está configurado nas variáveis de ambiente do servidor.",
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
        error: data.message || "Falha ao buscar anunciantes.",
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
      error: "Ocorreu um erro inesperado ao buscar anunciantes.",
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
        error: data.message || "Falha ao criar o pixel.",
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
    return { success: false, error: "Ocorreu um erro inesperado." };
  }
}

const trackEventSchema = z.object({
  accessToken: z.string(),
  pixelCode: z.string(),
  externalId: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  ttclid: z.string().optional(),
  productName: z.string(),
  productDescription: z.string().optional(),
  productPrice: z.number(),
  currency: z.string(),
  userAgent: z.string().optional(),
  ip: z.string().optional(),
});


function hashValue(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function trackEvent(params: z.infer<typeof trackEventSchema>) {
  try {
    const validatedParams = trackEventSchema.parse(params);
    const { accessToken, pixelCode, externalId, email, phone, productName, productDescription, productPrice, currency, ttclid, ip, userAgent } = validatedParams;

    const eventName = "Purchase";
    const eventTime = Math.floor(new Date().getTime() / 1000);
    
    const userObject: { [key: string]: string | null | undefined } = {
        email: email ? hashValue(email) : undefined,
        phone: phone ? hashValue(phone) : undefined,
        external_id: externalId || undefined,
        ttclid: ttclid || undefined,
        ip: ip || undefined,
        user_agent: userAgent || undefined
    };

    Object.keys(userObject).forEach(key => (userObject[key as keyof typeof userObject] === undefined || userObject[key as keyof typeof userObject] === null) && delete userObject[key as keyof typeof userObject]);


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
                content_id: externalId,
                content_name: productName,
                price: productPrice,
              },
            ],
            currency: currency,
            value: productPrice,
            content_type: "product",
            description: productDescription || "Este record é para teste do pixel.",
          },
          page: {
            url: "https://ia.litcode.store/produto/test-product",
            referrer: externalId,
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
        error: data.message || "Falha ao rastrear o evento.",
        details: data,
      };
    }

    return {
      success: true,
      data: data,
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
      error: "Ocorreu um erro inesperado ao rastrear o evento.",
    };
  }
}

const verifyEmailSchema = z.object({
  email: z.string().min(1, "Por favor, insira um e-mail válido ou código de acesso."),
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
        error: "A lista de e-mails não está configurada. Por favor, contate o suporte.",
      };
    }

    const allowedEmails = allowedEmailsStr.split(',').map(e => e.trim().toLowerCase());
    
    const emailValidation = z.string().email().safeParse(email);
    if (!emailValidation.success) {
      return { success: false, error: "Este e-mail não está autorizado." };
    }


    if (allowedEmails.includes(email.toLowerCase())) {
      return { success: true };
    } else {
      return { success: false, error: "Este e-mail não está autorizado." };
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
      error: "Não foi possível verificar o e-mail. A lista de permissões pode não estar configurada no Vercel Edge Config.",
    };
  }
}
