
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyEmail } from "@/app/actions";

const verifyEmailApiSchema = z.object({
  email: z.string().min(1, "Por favor, insira um e-mail válido ou código de acesso."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = verifyEmailApiSchema.safeParse(body);
    
    if (!validatedBody.success) {
      return NextResponse.json(
        { success: false, error: "Entrada inválida.", details: validatedBody.error.flatten() },
        { status: 400 }
      );
    }
    
    const result = await verifyEmail({ email: validatedBody.data.email });
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
