"use client";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type UserItem = {
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

export default function UsersPage() {
  const router = useRouter();

  const [data, setData] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userRaw);
    const organizationId = user.orgId
    const fetchUsers = async () => {
      try {
        // ⬇️ энд өөрийн USERS endpoint-оо тавина
        const res = await fetch(`http://172.12.99.99:6069/api/v2/Users/organization/${organizationId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Хэрэглэгчийн жагсаалт татаж чадсангүй");

        const json = await res.json();
        setData(json.result || []);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Алдаа гарлаа";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    if (!text) return data;

    return data.filter((u) => {
      const haystack = `${u.loginName} ${u.firstName} ${u.lastName} ${u.email} ${u.phone} ${u.orgName}`.toLowerCase();
      return haystack.includes(text);
    });
  }, [q, data]);

  if (loading) return <div className="text-slate-500">Ачааллаж байна...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Хэрэглэгч</h1>
          <p className="text-sm text-slate-500">Нийт: {filtered.length}</p>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Хайх (нэр, login, email, утас...)"
          className="w-full sm:w-80 rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>

              <Th>Login</Th>
              <Th>Нэр</Th>
              <Th>Байгууллага</Th>
              <Th>Email</Th>
              <Th>Утас</Th>
              <Th>Статус</Th>
              <Th>Үүссэн</Th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <Td className="font-medium">{u.loginName}</Td>
                <Td>
                  {u.firstName} {u.lastName}
                </Td>
                <Td>{u.orgName}</Td>
                <Td>{u.email}</Td>
                <Td>{u.phone}</Td>
                <Td>
                  <StatusBadge statusId={u.statusId} />
                </Td>
                <Td>{formatDate(u.createdAt)}</Td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-500">
                  Мэдээлэл олдсонгүй
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- UI helpers ---------------- */

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-3 font-medium">{children}</th>;
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 text-slate-800 ${className}`}>{children}</td>;
}

function StatusBadge({ statusId }: { statusId: number }) {
  const active = statusId === 1;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
        ${active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}
      `}
    >
      {active ? "Идэвхтэй" : "Идэвхгүй"}
    </span>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}
