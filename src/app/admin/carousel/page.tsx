import AdminLayout from "@/components/Admin/AdminLayout";
import CarouselManagement from "@/components/Admin/Carousel/index";

export const dynamic = "force-dynamic";

export default function CarouselPage() {
  return (
    <AdminLayout>
      <CarouselManagement />
    </AdminLayout>
  );
}
