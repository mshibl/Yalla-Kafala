"use client";

import { Message } from "ai";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Session } from "next-auth";
import { Files } from "./files";
import { FileIcon } from "./icons";
import { useScrollToBottom } from "./use-scroll-to-bottom";
import { Message as PreviewMessage } from "@/src/components/AIAssistant/message";
import { Box, TextField, Grid, Button, Typography } from "@mui/material";

const suggestedActions = [
  {
    title: "What's the summary",
    label: "of these documents?",
    action: "what's the summary of these documents?",
  },
  {
    title: "Who is the author",
    label: "of these documents?",
    action: "who is the author of these documents?",
  },
];

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const [selectedFilePathnames, setSelectedFilePathnames] = useState<
    Array<string>
  >([]);
  const [isFilesVisible, setIsFilesVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { messages, handleSubmit, input, setInput, append } = useChat({
    body: { id, selectedFilePathnames },
    initialMessages,
    onFinish: () => {
      window.history.replaceState({}, "", `/${id}`);
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "400px",
        width: "100%",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "rgb(24, 24, 27)" : "white",
      }}
    >
      <Box
        ref={messagesContainerRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          flex: 1,
          width: "100%",
          overflowY: "auto",
          px: 1,
        }}
      >
        {messages.map((message, index) => (
          <PreviewMessage
            key={`${id}-${index}`}
            role={message.role}
            content={message.content}
          />
        ))}
        <Box
          ref={messagesEndRef}
          sx={{
            flexShrink: 0,
            minWidth: "24px",
            minHeight: "24px",
          }}
        />
      </Box>

      {messages.length === 0 && (
        <Box
          sx={{
            width: "100%",
            px: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {suggestedActions.map((suggestedAction, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(39, 39, 42, 0.3)"
                    : "rgba(244, 244, 245, 0.5)",
                borderRadius: 2,
              }}
            >
              <Button
                onClick={async () => {
                  append({
                    role: "user",
                    content: suggestedAction.action,
                  });
                }}
                variant="outlined"
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  p: 0,
                  borderRadius: 2,
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgb(39 39 42)"
                      : "rgb(228 228 231)",
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgb(212 212 216)"
                      : "rgb(39 39 42)",
                  "&:hover": {
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgb(39 39 42)"
                        : "rgb(244 244 245)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="body2" padding={1}>
                    {suggestedAction.title} {suggestedAction.label}
                  </Typography>
                </Box>
              </Button>
            </Box>
          ))}
        </Box>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          position: "relative",
          alignItems: "center",
          width: "100%",
          p: 1,
        }}
      >
        <TextField
          fullWidth
          placeholder="Send a message..."
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
          variant="outlined"
          size="small"
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              padding: "4px",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgb(63 63 70)"
                  : "rgb(243 244 246)",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
            },
            "& .MuiInputBase-input": {
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgb(212 212 216)"
                  : "rgb(39 39 42)",
              padding: "4px",
            },
          }}
        />

        {/* <div
          className="relative text-sm bg-zinc-100 rounded-lg size-9 flex-shrink-0 flex flex-row items-center justify-center cursor-pointer hover:bg-zinc-200 dark:text-zinc-50 dark:bg-zinc-700 dark:hover:bg-zinc-800"
          onClick={() => {
            setIsFilesVisible(!isFilesVisible);
          }}
        >
          <FileIcon />
          <motion.div
            className="absolute text-xs -top-2 -right-2 bg-blue-500 size-5 rounded-full flex flex-row justify-center items-center border-2 dark:border-zinc-900 border-white text-blue-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {selectedFilePathnames?.length}
          </motion.div>
        </div> */}
      </Box>
    </Box>
  );
}
