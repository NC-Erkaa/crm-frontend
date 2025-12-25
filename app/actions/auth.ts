"use server";

import { cookies } from "next/headers";

type LoginState = {
  error: string | null;
  success: boolean;
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const loginName = formData.get("loginName");
  const password = formData.get("password");

  if (!loginName || !password) {
    return { error: "Нэвтрэх нэр болон нууц үг шаардлагатай", success: false };
  }

  try {
    const res = await fetch("http://172.12.99.99:6069/api/v2/Auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginName, password }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!data.status) {
      return {
        error: data.message || "Нэвтрэхэд алдаа гарлаа",
        success: false,
      };
    }

    const cookieStore = await cookies();

    cookieStore.set("token", data.result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    cookieStore.set("user", JSON.stringify(data.result.user), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return { error: null, success: true };
  } catch {
    return { error: "Сервертэй холбогдож чадсангүй", success: false };
  }
}
