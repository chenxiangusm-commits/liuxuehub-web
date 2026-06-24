"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { DEMO_SMS_CODE } from "@/lib/auth";
import { useApp } from "@/context/AppContext";

type LoginTab = "sms" | "wechat";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useApp();
  const [activeTab, setActiveTab] = useState<LoginTab>("sms");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const redirectTo = useMemo(() => {
    const next = searchParams.get("next");
    return next && next.startsWith("/") ? next : "/";
  }, [searchParams]);

  const normalizedPhone = phone.replace(/\D/g, "").slice(0, 11);
  const phoneValid = /^1[3-9]\d{9}$/.test(normalizedPhone);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const requestSmsCode = async () => {
    setMessage("");

    if (!phoneValid) {
      setMessage("请输入正确的中国大陆手机号");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };

      if (!res.ok || !data.ok) {
        setMessage(data.message || "验证码发送失败，请稍后再试");
        return;
      }

      setCountdown(60);
      setMessage(`验证码已发送。当前演示验证码：${DEMO_SMS_CODE}`);
    } catch {
      setMessage("网络异常，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  const submitSmsLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!phoneValid) {
      setMessage("请输入正确的中国大陆手机号");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setMessage("请输入6位短信验证码");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/sms/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone, code }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        user?: Parameters<typeof login>[0];
      };

      if (!res.ok || !data.ok || !data.user) {
        setMessage(data.message || "验证码错误，请重新输入");
        return;
      }

      login(data.user);
      router.push(redirectTo);
    } catch {
      setMessage("登录失败，请检查网络后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleWechatDemoLogin = () => {
    login({
      id: `wechat_demo_${Date.now()}`,
      nickname: "微信用户",
      loginMethod: "wechat",
      loggedInAt: new Date().toISOString(),
    });
    router.push(redirectTo);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="hidden lg:block">
          <div className="mb-6 inline-flex rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
            面向中国大陆用户的登录体系
          </div>
          <h1 className="max-w-xl text-5xl font-black leading-tight text-gray-950">
            登录后继续你的
            <span className="block text-blue-600">AI留学申请工作流</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            保存收藏院校、生成AI规划、管理文书和面试训练记录。手机号验证码优先，微信扫码作为中国大陆用户的快捷入口。
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {["收藏同步", "AI报告", "顾问跟进"].map((item) => (
              <div key={item} className="rounded-2xl border border-white bg-white/80 p-4 text-center shadow-sm">
                <div className="text-sm font-semibold text-gray-900">{item}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-3xl border border-white bg-white p-6 shadow-2xl shadow-blue-100 sm:p-8">
          <div className="mb-6 text-center">
            <Link href="/" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
              留
            </Link>
            <h2 className="text-2xl font-bold text-gray-950">登录 / 注册</h2>
            <p className="mt-2 text-sm text-gray-500">新用户验证手机号后自动创建账号</p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-2xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("sms");
                setMessage("");
              }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "sms" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
              }`}
            >
              手机验证码
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("wechat");
                setMessage("");
              }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "wechat" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
              }`}
            >
              微信扫码
            </button>
          </div>

          {activeTab === "sms" ? (
            <form onSubmit={submitSmsLogin} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">手机号</span>
                <div className="flex overflow-hidden rounded-2xl border border-gray-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <span className="flex items-center border-r border-gray-100 px-4 text-sm font-semibold text-gray-500">+86</span>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 11))}
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="请输入中国大陆手机号"
                    className="min-w-0 flex-1 px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">短信验证码</span>
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="6位验证码"
                    className="min-w-0 flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={requestSmsCode}
                    disabled={loading || countdown > 0}
                    className="w-32 rounded-2xl border border-blue-200 bg-blue-50 px-3 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {countdown > 0 ? `${countdown}s` : "获取验证码"}
                  </button>
                </div>
              </label>

              {message && (
                <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-700">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "处理中..." : "登录 / 注册"}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                <div className="mx-auto grid h-52 w-52 grid-cols-5 gap-1 rounded-2xl bg-white p-4 shadow-inner">
                  {Array.from({ length: 25 }).map((_, index) => (
                    <div
                      key={index}
                      className={`rounded-sm ${
                        [0, 1, 2, 5, 10, 15, 20, 21, 22, 4, 9, 14, 19, 24, 23, 18, 13, 8, 6, 12, 16].includes(index)
                          ? "bg-gray-950"
                          : "bg-white"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-4 text-center text-sm text-gray-500">
                  微信开放平台接入后，这里会显示真实扫码二维码。
                </p>
              </div>

              <button
                type="button"
                onClick={handleWechatDemoLogin}
                className="w-full rounded-2xl bg-[#07C160] px-4 py-3 font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-[#06ad56]"
              >
                我已扫码授权（演示）
              </button>

              <p className="text-center text-xs leading-5 text-gray-500">
                生产环境需要配置微信开放平台 AppID、AppSecret 和回调域名。
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-xs leading-5 text-gray-500">
            登录即表示同意《服务条款》和《隐私政策》。验证码登录当前为演示模式，生产环境请接入短信服务商。
          </p>
        </section>
      </div>
    </main>
  );
}

export default function LoginClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginForm />
    </Suspense>
  );
}
