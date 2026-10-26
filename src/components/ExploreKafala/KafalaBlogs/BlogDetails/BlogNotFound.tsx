import type { StoryCategory } from "@/lib/types";
import { translations } from "../translations";
import BackToBlogsButton from "./BackToBlogsButton";

export default function BlogNotFound({
  category = "blog",
}: {
  category?: StoryCategory;
}) {
  return (
    <div className="m-20 flex flex-col">
      <main className="flex-grow pt-24 md:pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {translations.notFound[category]}
          </h1>
          <BackToBlogsButton locale={"en"} category={category} />
        </div>
      </main>
    </div>
  );
}
