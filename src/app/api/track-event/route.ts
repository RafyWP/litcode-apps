
import { NextResponse, NextRequest } from "next/server";
import { trackEvent } from "@/app/actions";
import { z } from "zod";

const trackEventSchema = z.object({
  accessToken: z.string(),
  pixelCode: z.string(),
  externalId: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  productName: z.string(),
  productDescription: z.string().optional(),
  productPrice: z.number(),
  currency: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ip = req.ip ?? req.headers.get("x-forwarded-for");
    const userAgent = req.headers.get("user-agent");

    const validatedBody = trackEventSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request body.", details: validatedBody.error.flatten() },
        { status: 400 }
      );
    }
    
    const result = await trackEvent({
      ...validatedBody.data,
      ip: ip || undefined,
      userAgent: userAgent || undefined,
    });

    if (!result.success) {
        return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof z.ZodError) {
        errorMessage = error.errors.map((e) => e.message).join(", ");
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
    if(error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
