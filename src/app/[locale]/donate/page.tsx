import Donate from "@/components/Homepage/Donate";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { redirect } from "next/navigation";

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  redirect("https://givebutter.com/yallakafaladonations");
}
