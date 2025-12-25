"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = {
  error: null,
  success: false,
  token: null,
  user: null,
  modules: [],
};

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, pending] = React.useActionState(
    loginAction,
    initialState
  );

  useEffect(() => {
    if (state.success && state.token && state.user) {
      localStorage.setItem("token", state.token);
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("modules", JSON.stringify(state.modules ?? []));
      router.push("/dashboard");
    }
  }, [state.modules, state.success, state.token, state.user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-2xl bg-white/90 backdrop-blur border border-slate-200 shadow-lg p-7 space-y-5"
      >
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">Нэвтрэх</h1>
          <p className="text-sm text-slate-500">Системд нэвтрэх</p>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Login name</label>
          <input
            name="loginName"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-black"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-black"
          />
        </div>

        {state.error && (
          <p className="text-xs text-red-500 text-center">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white
                     hover:bg-blue-700 transition disabled:opacity-60"
        >
          {pending ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
        </button>
      </form>
    </div>
  );
}
