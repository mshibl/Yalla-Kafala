"use client";
import { useLocationData } from "@/src/utils/useLocationData";
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import React, { useState } from "react";

const DonationForm = ({ locale }: { locale: string }) => {
  const { locationData, loading, error } = useLocationData();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    educationInitiatives: false,
    advocacyInitiatives: false,
    resourceDevelopmentInitiatives: false,
    yallaKafalaAdmin: false,
  });

  if (loading || error || !locationData) return <Box height="500px" />;

  const country = locationData?.country.toLowerCase();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // Add your form submission logic here
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        marginY: { xs: "25px", md: "40px" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box component="label" sx={{ fontWeight: "bold", color: "primary.main" }}>
        {locale === "en" ? "First Name" : "الاسم الاول"}
      </Box>
      <TextField
        fullWidth
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        required
        variant="outlined"
        sx={{
          marginBottom: { xs: "10px", md: "30px" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#B9D7E0", // Default border color
              borderWidth: "4px",
            },
            "&:hover fieldset": {
              borderColor: "#B9D7E0", // Default border color
              borderWidth: "4px",
            },
          },
        }}
      />
      <Box component="label" sx={{ fontWeight: "bold", color: "primary.main" }}>
        {locale === "en" ? "Last Name" : "الاسم الاخير"}
      </Box>
      <TextField
        fullWidth
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        required
        variant="outlined"
        sx={{
          marginBottom: { xs: "10px", md: "30px" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#B9D7E0", // Default border color
              borderWidth: "4px",
            },
            "&:hover fieldset": {
              borderColor: "#B9D7E0", // Default border color
              borderWidth: "4px",
            },
          },
        }}
      />
      <Box component="label" sx={{ fontWeight: "bold", color: "primary.main" }}>
        {locale === "en" ? "Email" : "الايميل"}
      </Box>
      <TextField
        fullWidth
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        required
        variant="outlined"
        sx={{
          marginBottom: { xs: "10px", md: "30px" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#B9D7E0", // Default border color
              borderWidth: "4px",
            },
            "&:hover fieldset": {
              borderColor: "#B9D7E0", // Default border color
              borderWidth: "4px",
            },
          },
        }}
      />
      <Box component="label" sx={{ fontWeight: "bold", color: "primary.main" }}>
        {locale === "en" ? "Phone" : "الموبايل"}
      </Box>
      <TextField
        fullWidth
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        required
        variant="outlined"
        sx={{
          marginBottom: { xs: "10px", md: "30px" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#B9D7E0", // Default border color
              borderWidth: "4px",
            },
            "&:hover fieldset": {
              borderColor: "#B9D7E0", // Default border color
              borderWidth: "4px",
            },
          },
        }}
      />
      <Box component="h3" sx={{ fontWeight: "bold", color: "primary.main" }}>
        {locale === "en"
          ? " Which program do you want to contribute to?"
          : "إلى أي برنامج تريد المساهمة؟"}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <FormControlLabel
          sx={{ color: "primary.main" }}
          control={
            <Checkbox
              name="educationInitiatives"
              checked={formData.educationInitiatives}
              onChange={handleInputChange}
              sx={{
                "& .MuiSvgIcon-root": { fontSize: 72 },
                color: "#B9D7E0",
                "&.Mui-checked": {
                  color: "#B9D7E0",
                },
                "&.Mui-checked:hover": {
                  color: "#B9D7E0",
                },
              }}
            />
          }
          label={locale === "en" ? "Education Initiatives" : "مبادرات التعليم"}
        />
        <FormControlLabel
          sx={{ color: "primary.main" }}
          control={
            <Checkbox
              name="advocacyInitiatives"
              checked={formData.advocacyInitiatives}
              onChange={handleInputChange}
              sx={{
                "& .MuiSvgIcon-root": { fontSize: 72 },
                color: "#B9D7E0",
                "&.Mui-checked": {
                  color: "#B9D7E0",
                },
                "&.Mui-checked:hover": {
                  color: "#B9D7E0",
                },
              }}
            />
          }
          label={locale === "en" ? "Advocacy Initiatives" : "مبادرات المناصرة"}
        />
        <FormControlLabel
          sx={{ color: "primary.main" }}
          control={
            <Checkbox
              name="resourceDevelopmentInitiatives"
              checked={formData.resourceDevelopmentInitiatives}
              onChange={handleInputChange}
              sx={{
                "& .MuiSvgIcon-root": { fontSize: 72 },
                color: "#B9D7E0",
                "&.Mui-checked": {
                  color: "#B9D7E0",
                },
                "&.Mui-checked:hover": {
                  color: "#B9D7E0",
                },
              }}
            />
          }
          label={
            locale === "en"
              ? "Resource Development Initiatives"
              : "مبادرات تطوير الموارد"
          }
        />
        <FormControlLabel
          sx={{ color: "primary.main" }}
          control={
            <Checkbox
              name="yallaKafalaAdmin"
              checked={formData.yallaKafalaAdmin}
              onChange={handleInputChange}
              sx={{
                "& .MuiSvgIcon-root": { fontSize: 72 },
                color: "#B9D7E0",
                "&.Mui-checked": {
                  color: "#B9D7E0",
                },
                "&.Mui-checked:hover": {
                  color: "#B9D7E0",
                },
              }}
            />
          }
          label={
            locale === "en"
              ? "Yalla Kafala Admin/operations"
              : "إدارة/عمليات يلا كفالة"
          }
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        sx={{
          fontWeight: 600,
          backgroundColor: "#87226C",
          color: "#FFFFFF",
          fontSize: "40px",
          borderRadius: "100px",
          textTransform: "none",
          boxShadow: "none",
          marginTop: "80px",
        }}
      >
        {locale === "en" ? "Next" : "التالي"}
      </Button>
    </Box>
  );
};

export default DonationForm;
