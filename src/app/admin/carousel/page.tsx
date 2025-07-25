import AdminLayout from "@/components/Admin/AdminLayout";
import CarouselManagement from "@/components/Admin/Carousel/index";
import { fetchCarouselImages } from "@/server/actions/carouselImages/fetchCarouselImages";

export default async function CarouselPage() {
  const carouselImages = await fetchCarouselImages();
  if (!carouselImages.success || !carouselImages.data) {
    return (
      <div className="flex h-full items-center justify-center">
        Error fetching carousel images
      </div>
    );
  }
  return (
    <AdminLayout>
      <CarouselManagement carouselImages={carouselImages.data} />
    </AdminLayout>
  );
}
