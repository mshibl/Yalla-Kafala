"use client";
import Image from "next/image";
import { Box, Avatar, Typography, Paper } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import { Markdown } from "./markdown";

export function Message({ role, content }: { role: string; content: string }) {
  return (
    <Box display="flex" alignItems="flex-start">
      <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
        {role === "user" ? (
          <PersonIcon />
        ) : (
          <Image
            src="/images/yk_logo.svg"
            width={32}
            height={32}
            alt="YallaKafala logo"
          />
        )}
      </Avatar>
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {role === "user" ? "You" : "YallaKafala"}
        </Typography>
        <Paper elevation={0} sx={{ bgcolor: "background.default" }}>
          <Markdown>{content}</Markdown>
        </Paper>
      </Box>
    </Box>
  );
}
