import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { FacebookPost } from "./FacebookPost";
import { fetchFacebookPosts } from "@/server/actions/fetchFacebookPosts";
import Link from "next/link";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="rounded-xl overflow-hidden shadow-md">
        <Skeleton className="h-48 w-full" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    ))}
  </div>
);

const FacebookPostsContent = async () => {
  const posts = await fetchFacebookPosts();
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {posts.map((post, index) => (
        <FacebookPost key={post.id} post={post} index={index} />
      ))}
    </div>
  );
};

const FacebookPosts = ({ locale }: { locale: Locale }) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 opacity-100 transition-all duration-500">
          <div className="inline-block bg-accent/10 text-accent font-medium px-4 py-2 rounded-full mb-4">
            {translations.chip[locale]}
          </div>
          <h2 className="heading-md text-primary mb-6">
            {translations.title[locale]}
          </h2>
          <p className="text-gray-600">{translations.description[locale]}</p>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <FacebookPostsContent />
        </Suspense>

        <div className="text-center mt-12">
          <Link href="https://facebook.com/yallakafala" target="_blank">
            <Button size="lg" className="bg-[#1877F2] hover:bg-[#1877F2]/90">
              {translations.visitPageButton[locale]}
              <ExternalLink size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FacebookPosts;
