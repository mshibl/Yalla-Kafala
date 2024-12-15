import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

interface UserInfo {
  name: string;
  mobile: string;
}

export const UserInfoForm = ({
  locale,
  submitUserInfo,
}: {
  locale: string;
  submitUserInfo: (userInfo: UserInfo) => void;
}) => {
  const handleNameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const mobile = formData.get("mobile") as string;

    if (name.trim() && mobile.trim()) {
      submitUserInfo({
        name: name.trim(),
        mobile: mobile.trim(),
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleNameSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ fontSize: "16px", lineHeight: "1.5", mb: "8px" }}>
        {locale === "ar"
          ? "مرحباً 👋 من فضلك أدخل بياناتك للبدء في المحادثة"
          : "Hello 👋 Please enter your details to start chatting"}
      </Box>
      <TextField
        autoFocus={true}
        required
        name="name"
        fullWidth
        placeholder={locale === "ar" ? "الاسم" : "Name"}
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: "8px",
            mb: "8px",
          },
          "& .MuiInputBase-input": {
            fontSize: "20px",
          },
        }}
      />

      {/* TODO: Replace with a more advanced phone input component, preferably one that includes country search, auto-formatting, and validation */}
      <TextField
        required
        name="mobile"
        fullWidth
        type="tel"
        placeholder={locale === "ar" ? "رقم الهاتف المحمول" : "Mobile number"}
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: "8px",
          },
          "& .MuiInputBase-input": {
            fontSize: "20px",
            textAlign: locale === "ar" ? "right" : "left",
          },
          "& .MuiFormHelperText-root": {
            fontSize: "14px",
            textAlign: locale === "ar" ? "right" : "left",
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mt: "16px", borderRadius: "8px", fontSize: "20px", textTransform: "none" }}
      >
        {locale === "ar" ? "بدء المحادثة" : "Start Chatting"}
      </Button>
    </Box>
  );
};
