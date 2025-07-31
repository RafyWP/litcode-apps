
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { trackEvent } from "@/app/actions";

const trackEventApiSchema = z.object({
  accessToken: z.string(),
  pixelCode: z.string(),
  externalId: z.string(),
  email: z.string().optional(),
  ttclid: z.string().optional(),
  productName: z.string(),
  productDescription: z.string().optional(),
  productPrice: z.number(),
  currency: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ip = req.headers.get("x-forwarded-for");
    const userAgent = req.headers.get("user-agent");

    const validatedBody = trackEventApiSchema.safeParse(body);
    
    if (!validatedBody.success) {
      return NextResponse.json(
        { success: false, error: validatedBody.error.flatten() },
        { status: 400 }
      );
    }
    
    const result = await trackEvent({
      ...validatedBody.data,
      ip: ip ?? undefined,
      userAgent: userAgent ?? undefined,
    });
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
