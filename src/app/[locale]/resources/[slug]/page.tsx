import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { notFound, redirect } from "next/navigation";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { slug } = await params;
  const resource = await fetchQuery(api.resources.queries.getResourceBySlug, {
    slug,
  });

  if (!resource) {
    notFound();
  }

  redirect(resource.link);
}
