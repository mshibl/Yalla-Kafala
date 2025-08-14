import BackToStoriesButton from "./BackToStoriesButton";

export default function StoryNotFound() {
  return (
    <div className="m-20 flex flex-col">
      <main className="flex-grow pt-24 md:pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Story Not Found</h1>
          <BackToStoriesButton locale={"en"} />
        </div>
      </main>
    </div>
  );
}
