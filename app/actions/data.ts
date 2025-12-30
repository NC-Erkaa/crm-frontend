"use server";

import { cookies } from "next/headers";

export type Organization = {
  id: number;
  name: string;
  shortName: string;
  regNo: string;
  address: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  statusId: number;
};

export type UserItem = {
  id: number;
  loginName: string;
  firstName: string;
  lastName: string;
  orgName: string;
  avatar: string;
  regNo: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string | null;
  statusId: number;
};

export type ATM = {
  id: number,
  atmName: string,
  serialNumber: string,
  status: string,
  fullLocation: string,
  isExpired: boolean

};

type FetchResult<T> = { data: T | null; error: string | null };

type AuthContext = {
  token: string;
  orgId: number;
};

async function readAuthOrNull(): Promise<AuthContext | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const orgIdRaw = cookieStore.get("orgId")?.value;

  if (!token || !orgIdRaw) return null;

  const orgId = Number(orgIdRaw);
  if (!Number.isFinite(orgId)) return null;

  return { token, orgId };
}

export async function fetchATM():Promise<FetchResult<ATM>> {
  try {
    const auth = await readAuthOrNull();
    if (!auth) return { data: null, error: "Unauthorized" };

    const res = await fetch(
      `${process.env.BACKEND_URL}/api/v1/ATM/getATMs/${auth.orgId}`,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
        cache: "no-store",
      }
    );

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.status) {
      return { data: null, error: json?.message || "Мэдээлэл олдсонгүй" };
    }

    return { data: json.result as ATM, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return { data: null, error: message };
  }
}

export async function fetchOrganization(): Promise<FetchResult<Organization>> {
  try {
    const auth = await readAuthOrNull();
    if (!auth) return { data: null, error: "Unauthorized" };

    const res = await fetch(
      `${process.env.BACKEND_URL}/api/v2/Organizations/${auth.orgId}`,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
        cache: "no-store",
      }
    );

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.status) {
      return { data: null, error: json?.message || "Мэдээлэл олдсонгүй" };
    }

    return { data: json.result as Organization, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return { data: null, error: message };
  }
}

export async function fetchUsers(): Promise<FetchResult<UserItem[]>> {
  try {
    const auth = await readAuthOrNull();
    if (!auth) return { data: null, error: "Unauthorized" };

    const res = await fetch(
      `${process.env.BACKEND_URL}/api/v2/Users/organization/${auth.orgId}`,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
        cache: "no-store",
      }
    );

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.status) {
      return {
        data: null,
        error: json?.message || "Хэрэглэгчийн жагсаалт татаж чадсангүй",
      };
    }

    return { data: (json.result ?? []) as UserItem[], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return { data: null, error: message };
  }
}
