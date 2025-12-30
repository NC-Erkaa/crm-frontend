import { redirect } from "next/navigation";
import { fetchATM } from "@/app/actions/data";
import ATMTableClient from "./atm-client";

export default async function ATMPage() {
  const r = await fetchATM();

  if (!r?.data || !Array.isArray(r.data)) {
    redirect("/login");
  }

  return <ATMTableClient atms={r.data} />;
}
