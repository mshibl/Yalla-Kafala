import BlogsManagement from "@/components/Admin/Blogs/index";
import AdminLayout from "@/components/Admin/AdminLayout";
import { fetchBlogs } from "@/server/actions/blogs/fetchBlogs";

export const dynamic = "force-dynamic";
export default async function BlogsPage() {
  const blogs = await fetchBlogs({ publishedOnly: false });
  if (!blogs.success || !blogs.data) {
    return (
      <div className="flex h-full items-center justify-center">
        Error fetching Blogs
      </div>
    );
  }
  return (
    <AdminLayout>
      <BlogsManagement blogs={blogs.data} />
    </AdminLayout>
  );
}
