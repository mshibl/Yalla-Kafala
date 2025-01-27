"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

export default function Return() {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    fetch(`/api/checkout_sessions?session_id=${sessionId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          backgroundColor: "white",
          padding: { xs: "32px", md: "58px" },
          textAlign: "center",
        }}
      >
        <Image
          src="/images/yk_logo.svg"
          alt="Yalla Kafala"
          width={150}
          height={115}
          style={{
            marginBottom: "2rem",
          }}
          priority
        />
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "24px", md: "50px" },
            fontWeight: "bold",
            marginBottom: { xs: "10px", md: "35px" },
            lineHeight: { xs: "32px", md: "61px" },
            color: "primary.main",
          }}
        >
          Thank You for Your Support!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "16px", md: "24px" },
            lineHeight: { xs: "25px", md: "32px" },
            maxWidth: "800px",
            marginBottom: "2rem",
            color: "secondary.main",
          }}
        >
          Your generous donation helps us build a better future for orphans and
          Kafala families in Egypt. Together, we can provide care, education,
          and support to children who need it most.
        </Typography>
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {/* A confirmation email will be sent to {customerEmail}.*/}
          If you have any questions, please contact us at{" "}
          <a
            href="mailto:info@yallakafala.org"
            style={{ color: "#2194BC", textDecoration: "underline" }}
          >
            info@yallakafala.org
          </a>
        </Typography>
      </Box>
    );
  }

  return null;
}
