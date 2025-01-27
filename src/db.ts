import { drizzle } from "drizzle-orm/postgres-js";
import { eq, inArray } from "drizzle-orm/sql";
import postgres from "postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { chat, chunk, message, user } from "@/schema";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

export async function getUser(email: string) {
  return await db.select().from(user).where(eq(user.email, email));
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(user).values({ email, password: hash });
}

export async function createMessage({
  chatId,
  content,
  authorName,
  authorMobile,
  role,
}: {
  chatId: string;
  content: string;
  authorName?: string;
  authorMobile?: string;
  role: string;
}) {
  await db.insert(message).values({
    chatId,
    role,
    content,
    authorName,
    authorMobile,
  });
}

export async function getMessagesByChatId({ chatId }: { chatId: string }) {
  const result = await db
    .select({
      role: message.role,
      content: message.content,
    })
    .from(message)
    .where(eq(message.chatId, chatId))
    .limit(10);
  return result;
}

export async function createChat({ id }: { id: string }) {
  return await db.insert(chat).values({
    id,
  });
}

export async function getChatById({ id }: { id: string }) {
  const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
  return selectedChat;
}

export async function insertChunks({ chunks }: { chunks: any[] }) {
  return await db.insert(chunk).values(chunks);
}

export async function getChunksByFilePaths({
  filePaths,
}: {
  filePaths: Array<string>;
}) {
  return await db
    .select()
    .from(chunk)
    .where(inArray(chunk.filePath, filePaths));
}

export async function deleteChunksByFilePath({
  filePath,
}: {
  filePath: string;
}) {
  return await db.delete(chunk).where(eq(chunk.filePath, filePath));
}
