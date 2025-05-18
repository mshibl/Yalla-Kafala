import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "apple-developer-merchantid-domain-association"
  );

  try {
    const fileBuffer = await fs.promises.readFile(filePath);
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    return new Response("File not found", { status: 404 });
  }
}
