import { drizzle } from "drizzle-orm/postgres-js";
import { eq, inArray, and } from "drizzle-orm/sql";
import postgres from "postgres";
import { chat, chunk, message, user } from "@/drizzle/schema";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

// 🧍🏽‍♂️ "USER" TABLE DB FUNCTIONS
// ------------------------------------------------------------

export async function createUser(userData: typeof user.$inferInsert) {
  const result = await db.insert(user).values({
    email: userData.email,
    phone: userData.phone,
    name: userData.name,
    signupMethod: userData.signupMethod,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
    whatsappProfileName: userData.whatsappProfileName,
    whatsappWaId: userData.whatsappWaId,
  });

  return result[0];
}

export async function updateUser(
  id: string,
  userData: typeof user.$inferInsert
) {
  const result = await db
    .update(user)
    .set(userData)
    .where(eq(user.id, id))
    .returning();
  return result[0];
}

export async function getUserByEmail({ email }: { email: string }) {
  const result = await db.select().from(user).where(eq(user.email, email));
  return result[0];
}

export async function getUserByPhoneNumber({
  phoneNumber,
}: {
  phoneNumber: string;
}) {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.phone, phoneNumber));
  return result[0];
}

export async function getUserByWhatsappWaId({
  whatsappWaId,
}: {
  whatsappWaId: string;
}) {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.whatsappWaId, whatsappWaId));
  return result[0];
}

// 💬 "MESSAGE" TABLE DB FUNCTIONS
// ------------------------------------------------------------
export async function createMessage(messageData: typeof message.$inferInsert) {
  const result = await db.insert(message).values(messageData).returning();
  return result[0];
}

export async function getMessageByWhatsappMessageSid({
  whatsappMessageSid,
}: {
  whatsappMessageSid: string;
}) {
  const result = await db
    .select()
    .from(message)
    .where(eq(message.whatsappMessageSid, whatsappMessageSid));
  return result[0];
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

// 💬"CHAT" TABLE DB FUNCTIONS
// ------------------------------------------------------------
export async function createChat(chatData: typeof chat.$inferInsert) {
  const result = await db.insert(chat).values(chatData).returning();
  return result[0];
}

export async function getChatById({ id }: { id: string }) {
  const result = await db.select().from(chat).where(eq(chat.id, id));
  return result[0];
}

export async function getChatByUserId({ userId }: { userId: string }) {
  const result = await db.select().from(chat).where(eq(chat.userId, userId));
  return result[0];
}

// <🛑 NOT USED YET 🛑> 📄"CHUNK" TABLE DB FUNCTIONS
// ------------------------------------------------------------
export async function insertChunks({ chunks }: { chunks: any[] }) {
  const result = await db.insert(chunk).values(chunks).returning();
  return result;
}

export async function getChunksByFilePaths({
  filePaths,
}: {
  filePaths: Array<string>;
}) {
  const result = await db
    .select()
    .from(chunk)
    .where(inArray(chunk.filePath, filePaths));
  return result;
}

export async function deleteChunksByFilePath({
  filePath,
}: {
  filePath: string;
}) {
  const result = await db
    .delete(chunk)
    .where(eq(chunk.filePath, filePath))
    .returning();
  return result;
}
