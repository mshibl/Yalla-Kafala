import { relations } from "drizzle-orm/relations";
import { chat, message } from "./schema";

export const messageRelations = relations(message, ({one}) => ({
	chat: one(chat, {
		fields: [message.chatId],
		references: [chat.id]
	}),
}));

export const chatRelations = relations(chat, ({many}) => ({
	messages: many(message),
}));