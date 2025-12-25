"use server";

import { cookies } from "next/headers";

type Module = {
  id: number;
  nameMn: string;
  nameEn: string;
  url: string;
  subModules?: Module[];
};

type User = {
  id: number;
  loginName: string;
  firstName: string;
  lastName: string;
  regNo: string;
  email: string;
  phone: string;
  avatar: string;
  createdDate: string;
  createdBy: number;
  updatedBy: number | null;
  statusId: number;
  status: string | null;
  orgId: number;
};

export type LoginState = {
  error: string | null;
  success: boolean;
  token: string | null;
  user: User | null;
  modules: Module[];
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const loginName = formData.get("loginName");
  const password = formData.get("password");

  if (!loginName || !password) {
    return {
      error: "Нэвтрэх нэр болон нууц үг шаардлагатай",
      success: false,
      token: null,
      user: null,
      modules: [],
    };
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
        token: null,
        user: null,
        modules: [],
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

    return {
      error: null,
      success: true,
      token: data.result.token,
      user: data.result.user,
      modules: data.result.modules ?? [],
    };
  } catch {
    return {
      error: "Сервертэй холбогдож чадсангүй",
      success: false,
      token: null,
      user: null,
      modules: [],
    };
  }
}
