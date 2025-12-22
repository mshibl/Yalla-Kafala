import BackToBlogsButton from "./BackToBlogsButton";

export default function BlogNotFound() {
  return (
    <div className="m-20 flex flex-col">
      <main className="flex-grow pt-24 md:pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Not Found</h1>
          <BackToBlogsButton locale={"en"} />
        </div>
      </main>
    </div>
  );
}
