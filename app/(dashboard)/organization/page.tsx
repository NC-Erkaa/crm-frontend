"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

type Organization = {
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

export default function OrganizationDetailPage() {
  const router = useRouter();

  const [data, setData] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userRaw);
    console.log(user)
    const organizationId = user?.orgId; 

    if (!organizationId) {
      setError("Байгууллагын ID олдсонгүй");
      setLoading(false);
      return;
    }

    const fetchOrganization = async () => {
      try {
        const res = await fetch(
          `http://172.12.99.99:6069/api/v2/Organizations/${organizationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Мэдээлэл олдсонгүй");
        }

        const json = await res.json();
        setData(json.result);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Алдаа гарлаа";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [router]);

  /* ---------------- UI STATES ---------------- */

  if (loading) {
    return <div className="text-slate-500">Ачааллаж байна...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!data) return null;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {data.name}
        </h1>
        <p className="text-sm text-slate-500">
          Байгууллагын дэлгэрэнгүй мэдээлэл
        </p>
      </div>

      {/* Card */}
      <div className="rounded-xl border bg-white p-6 space-y-4">
        <Info label="Товч нэр" value={data.shortName} />
        <Info label="Регистр" value={data.regNo} />
        <Info label="Хаяг" value={data.address} />
        <Info
          label="Статус"
          value={data.statusId === 1 ? "Идэвхтэй" : "Идэвхгүй"}
        />
        <Info
          label="Үүсгэсэн огноо"
          value={new Date(data.createdAt).toLocaleString()}
        />
        <Info
          label="Шинэчилсэн огноо"
          value={new Date(data.updatedAt).toLocaleString()}
        />
      </div>
    </div>
  );
}

/* ---------------- Reusable row ---------------- */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-6">
      <div className="w-40 text-sm text-slate-500">{label}</div>
      <div className="text-sm text-slate-900">{value}</div>
    </div>
  );
}
