"use client";
import React, { useState } from "react";
import { Box, Fab, Popover, Typography, Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { Chat } from "./chat";

const ChatAssistant = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1300,
      }}
    >
      <Fab color="primary" aria-label="chat" onClick={handleClick}>
        <ChatIcon />
      </Fab>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Box sx={{ width: "330px", px: 0.5, pt: 1 }}>
          <Chat initialMessages={[]} id="chat-assistant" />
        </Box>
      </Popover>
    </Box>
  );
};

export default ChatAssistant;
