"use client";

import React, { useState, useEffect, useRef } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { Slide } from "@mui/material";
import useResponsiveBreakpoint from "@/src/utils/mui-utils";
import { useLocale } from "next-intl";
import { Dialog, Fab, Popover, Box } from "@mui/material";
import { AIChat } from "./chat";
import ChatInput from "./chat-input";

const LOCAL_STORAGE_USER_KEY = "yalla_kafala_user";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Chat = () => {
  const locale = useLocale();
  const isMobile = !useResponsiveBreakpoint("md");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const id = open ? "chatbot-popover" : undefined;

  useEffect(() => {
    if (!userInfo) {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
      }
    }
  }, [open, userInfo]);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isMobile) {
      setAnchorEl(event.currentTarget);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <Dialog
          open={open}
          fullScreen={isMobile}
          onClose={handleClose}
          TransitionComponent={isMobile ? Transition : undefined}
          keepMounted={true}
          mountOnEnter={true}
        >
          <AIChat locale={locale} userInfo={userInfo} onClose={handleClose} />
        </Dialog>
        <ChatInput
          useAsButton={true}
          locale={locale}
          handleInputClick={handleOpen}
        />
      </>
    );
  }
  
  return (
    <>
      <Fab
        aria-label="Open chat"
        aria-describedby={id}
        onClick={handleOpen}
        sx={{
          backgroundColor: "#2194BC",
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <Box fontSize="30px">👩🏻‍🏫</Box>
      </Fab>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            width: "40vw",
            height: "70vh",
          }}
        >
          <AIChat locale={locale} userInfo={userInfo} onClose={handleClose} />
        </Box>
      </Popover>
    </>
  );
};

export default Chat;
