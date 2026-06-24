import { NextRequest, NextResponse } from "next/server";
import { AuthUser, DEMO_SMS_CODE } from "@/lib/auth";

export const dynamic = "force-dynamic";

const phonePattern = /^1[3-9]\d{9}$/;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { phone?: string; code?: string };
    const phone = String(body.phone || "").replace(/\D/g, "");
    const code = String(body.code || "").replace(/\D/g, "");

    if (!phonePattern.test(phone)) {
      return NextResponse.json(
        { ok: false, message: "请输入正确的中国大陆手机号" },
        { status: 400 },
      );
    }

    if (code !== DEMO_SMS_CODE) {
      return NextResponse.json(
        { ok: false, message: `演示环境验证码为 ${DEMO_SMS_CODE}` },
        { status: 401 },
      );
    }

    const user: AuthUser = {
      id: `phone_${phone}`,
      phone,
      nickname: `用户${phone.slice(-4)}`,
      loginMethod: "sms",
      loggedInAt: new Date().toISOString(),
    };

    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json(
      { ok: false, message: "请求格式错误" },
      { status: 400 },
    );
  }
}
