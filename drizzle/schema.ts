import {
  pgTable,
  text,
  real,
  timestamp,
  foreignKey,
  uuid,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";

export const chunk = pgTable("Chunk", {
  id: text("id").primaryKey().notNull(),
  filePath: text("filePath").notNull(),
  content: text("content").notNull(),
  embedding: real("embedding").array().notNull(),
});

export const chat = pgTable("Chat", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  userId: text("user_id"),
});

export const message = pgTable(
  "Message",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    chatId: text("chat_id"),
    role: varchar("role", { length: 50 }).notNull(),
    content: text("content").notNull(),
    authorName: varchar("author_name", { length: 64 }),
    authorMobile: varchar("author_mobile", { length: 50 }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    channel: varchar("channel", { length: 20 }).default("web"),
    userId: text("user_id"),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    whatsappMessageSid: text("whatsapp_message_sid"),
    whatsappAccountSid: text("whatsapp_account_sid"),
    whatsappMessagingServiceSid: text("whatsapp_messaging_service_sid"),
    whatsappMessageType: varchar("whatsapp_message_type", { length: 20 }),
    whatsappNumMedia: text("whatsapp_num_media"),
    whatsappNumSegments: text("whatsapp_num_segments"),
    whatsappReferralNumMedia: text("whatsapp_referral_num_media"),
    whatsappMediaUrls: jsonb("whatsapp_media_urls"),
    whatsappApiVersion: text("whatsapp_api_version"),
  },
  (table) => {
    return {
      messageChatIdChatIdFk: foreignKey({
        columns: [table.chatId],
        foreignColumns: [chat.id],
        name: "Message_chat_id_Chat_id_fk",
      }).onDelete("cascade"),
    };
  }
);

export const user = pgTable("User", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  email: varchar("email", { length: 64 }),
  phone: varchar("phone", { length: 20 }),
  name: varchar("name", { length: 64 }),
  signupMethod: varchar("signup_method", { length: 20 }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  whatsappProfileName: text("whatsapp_profile_name"),
  whatsappWaId: text("whatsapp_wa_id"),
});
