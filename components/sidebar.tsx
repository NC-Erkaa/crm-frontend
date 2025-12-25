"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronDown,
  Home,
  Users,
  Building,
  Laptop,
  FileText,
  Package,
  LogOut,
} from "lucide-react";

/* ---------------- Types ---------------- */

type Module = {
  id: number;
  nameMn: string;
  nameEn: string;
  url: string;
  subModules?: Module[];
};

/* ---------------- Icons ---------------- */

const getIconByUrl = (url: string) => {
  switch (url) {
    case "/dashboard":
      return <Home size={18} />;
    case "/user":
      return <Users size={18} />;
    case "/organization":
      return <Building size={18} />;
    case "/atm":
      return <Laptop size={18} />;
    case "/settings":
      return <Package size={18} />;
    default:
      return <FileText size={18} />;
  }
};

/* ---------------- Sidebar ---------------- */

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const modules: Module[] =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("modules") || "[]")
      : [];

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const isActiveRoute = (url: string) => pathname.startsWith(url);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <aside className="w-80 h-screen flex flex-col justify-between py-6 pr-4 border-r border-white/10 bg-slate-900 text-white">
      {/* ---------------- Header ---------------- */}
      <div>
        <div className="flex items-center gap-2 px-6 mb-10">
          <h1 className="text-lg font-semibold">ATM System</h1>
        </div>

        {/* ---------------- Menu ---------------- */}
        <nav className="flex flex-col gap-2">
          {modules.map((item) => {
            const isActive = isActiveRoute(item.url);
            const hasSubmenu = item.subModules && item.subModules.length > 0;
            const isOpen = openMenuId === item.id;

            return (
              <div key={item.id}>
                {/* Parent */}
                <div
                  className={`flex items-center justify-between gap-3 pl-4 py-3 ml-3 rounded-l-xl cursor-pointer transition
                    ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/70 hover:bg-white/10"
                    }
                  `}
                  onClick={() =>
                    hasSubmenu
                      ? setOpenMenuId(isOpen ? null : item.id)
                      : router.push(item.url)
                  }
                >
                  <div className="flex items-center gap-3">
                    {getIconByUrl(item.url)}
                    <span className="text-sm">{item.nameMn}</span>
                  </div>
                  {hasSubmenu &&
                    (isOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    ))}
                </div>

                {/* Sub menu */}
                {hasSubmenu && isOpen && (
                  <div className="ml-8 mt-1 flex flex-col gap-1">
                    {item.subModules!.map((sub) => {
                      const subActive = isActiveRoute(sub.url);

                      return (
                        <Link
                          key={sub.id}
                          href={sub.url}
                          className={`pl-4 py-2 rounded-l-xl text-sm transition
                            ${
                              subActive
                                ? "bg-white/20 text-white border border-white/20"
                                : "text-white/60 hover:bg-white/10 hover:text-white"
                            }
                          `}
                        >
                          {sub.nameMn}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* ---------------- Footer ---------------- */}
      <div className="px-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
            <span className="text-sm font-semibold">
              {user?.firstName?.charAt(0) ?? "?"}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.firstName}</p>
            <p className="text-xs text-white/60">{user?.loginName}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <LogOut size={16} /> Гарах
        </button>
      </div>
    </aside>
  );
}
