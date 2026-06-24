import { NextRequest, NextResponse } from "next/server";
import { DEMO_SMS_CODE } from "@/lib/auth";

export const dynamic = "force-dynamic";

const phonePattern = /^1[3-9]\d{9}$/;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { phone?: string };
    const phone = String(body.phone || "").replace(/\D/g, "");

    if (!phonePattern.test(phone)) {
      return NextResponse.json(
        { ok: false, message: "请输入正确的中国大陆手机号" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "验证码已发送",
      demoCode: process.env.NODE_ENV === "production" ? undefined : DEMO_SMS_CODE,
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "请求格式错误" },
      { status: 400 },
    );
  }
}
