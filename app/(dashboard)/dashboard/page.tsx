"use client";
import React from "react";
export default function DashboardPage() {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Хянах самбар
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Системийн ерөнхий мэдээлэл
        </p>
      </div>

      {/* Welcome card */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-slate-700">
          Сайн байна уу,{" "}
          <span className="font-medium">
            {user?.firstName || "Хэрэглэгч"}
          </span>
          👋
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Та системд амжилттай нэвтэрлээ.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Нийт хэрэглэгч" value="128" />
        <StatCard title="Байгууллага" value="32" />
        <StatCard title="АТМ" value="56" />
        <StatCard title="Нээлттэй таск" value="14" />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}
