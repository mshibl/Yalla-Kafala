import BlogsManagement from "@/components/Admin/Blogs/index";
import AdminLayout from "@/components/Admin/AdminLayout";

export const dynamic = "force-dynamic";

export default function BlogsPage() {
  return (
    <AdminLayout>
      <BlogsManagement />
    </AdminLayout>
  );
}
