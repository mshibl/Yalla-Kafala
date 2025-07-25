import { fetchStories } from "@/server/actions/stories/fetchStories";
import StoriesManagement from "@/components/Admin/Stories/index";
import AdminLayout from "@/components/Admin/AdminLayout";

export default async function StoriesPage() {
  const stories = await fetchStories({ publishedOnly: false });
  if (!stories.success || !stories.data) {
    return (
      <div className="flex h-full items-center justify-center">
        Error fetching Stories
      </div>
    );
  }
  return (
    <AdminLayout>
      <StoriesManagement stories={stories.data} />
    </AdminLayout>
  );
}
