import AdminLayout from "@/components/Admin/AdminLayout";
import ResourcesManagement from "@/components/Admin/Resources";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  return (
    <AdminLayout>
      <ResourcesManagement />
    </AdminLayout>
  );
}
