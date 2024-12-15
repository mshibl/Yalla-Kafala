"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { Box, Typography, List, IconButton, Skeleton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";
import ChatInput from "./chat-input";
import { generateId } from "ai";
import { SuggestedQuestions } from "./suggested-questions";
import { UserInfoForm } from "./user-info-form";
import { ChatMessage } from "./chat-message";

const LOCAL_STORAGE_USER_KEY = "yalla_kafala_user";

interface UserInfo {
  name: string;
  mobile: string;
}

export const AIChat = ({
  locale,
  userInfo,
  onClose,
}: {
  userInfo?: UserInfo | null;
  locale: "ar" | "en";
  onClose: () => void;
}) => {
  const [showNameForm, setShowNameForm] = useState(false);
  const [userNameAndMobile, setUserNameAndMobile] = useState<UserInfo | null>(
    null
  );
  const [chatId] = useState(generateId(10));
  const id = open ? "chatbot-popover" : undefined;

  const { messages, input, setInput, handleInputChange, append, handleSubmit } =
    useChat({
      body: {
        id: chatId,
        authorName: userInfo?.name,
        authorMobile: userInfo?.mobile,
      },
    });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setUserNameAndMobile(userInfo);
    } else {
      setShowNameForm(true);
    }
  }, [userInfo]);

  const submitUserInfo = (userInfo: UserInfo) => {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userInfo));
    setUserNameAndMobile(userInfo);
    setShowNameForm(false);
  };

  const handleSuggestedAction = (action: string) => {
    append({
      role: "user",
      content: action,
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        id="chat-header"
        sx={{
          px: "16px",
          py: "8px",
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          {locale === "ar" ? "✨ يلا كفالة AI" : "✨ Yalla Kafala AI"}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {showNameForm ? (
        <Box sx={{ p: "16px" }}>
          <UserInfoForm locale={locale} submitUserInfo={submitUserInfo} />
        </Box>
      ) : (
        <Box
          id="chat-container"
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            overflow: "auto",
          }}
        >
          <Box sx={{ p: "16px", flexGrow: 1, overflow: "auto" }}>
            <List sx={{ overflow: "auto" }}>
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} locale={locale} />
              ))}
              {messages.length > 0 &&
                messages[messages.length - 1].role !== "assistant" && (
                  <ChatMessage
                    locale={locale}
                    key={uuidv4()}
                    message={{
                      id: uuidv4(),
                      content: (
                        <Skeleton variant="text" width={210} height={40} />
                      ),
                      role: "assistant",
                    }}
                  />
                )}
              <div ref={messagesEndRef} />
            </List>
            {messages.length === 0 && (
              <SuggestedQuestions
                locale={locale}
                handleSuggestedAction={handleSuggestedAction}
              />
            )}
          </Box>
          <ChatInput
            locale={locale}
            input={input}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
          />
        </Box>
      )}
    </Box>
  );
};
