import FaqsManagement from "@/components/Admin/Faqs/index";
import { fetchFaqs } from "@/server/actions/faqs/fetchFaqs";
import AdminLayout from "@/components/Admin/AdminLayout";
export default async function FaqsPage() {
  const faqs = await fetchFaqs({ publishedOnly: false });
  if (!faqs.success || !faqs.data) {
    return (
      <div className="flex h-full items-center justify-center">
        Error fetching FAQs
      </div>
    );
  }
  return (
    <AdminLayout>
      <FaqsManagement faqs={faqs.data} />
    </AdminLayout>
  );
}
