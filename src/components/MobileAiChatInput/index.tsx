"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import Chat, { useChatState } from "../AIAssistant/chat";
import ChatInput from "../AIAssistant/chat-input";

const MobileAIChatInput = ({ locale }: { locale: "ar" | "en" }) => {
  return <Chat locale={locale} />;
};

export default MobileAIChatInput;
