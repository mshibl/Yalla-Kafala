import AdminLayout from "@/components/Admin/AdminLayout";
import BoardMembersManagement from "@/components/Admin/BoardMembers";

export const dynamic = "force-dynamic";
export default async function BoardMembersPage() {
  return (
    <AdminLayout>
      <BoardMembersManagement />
    </AdminLayout>
  );
}
