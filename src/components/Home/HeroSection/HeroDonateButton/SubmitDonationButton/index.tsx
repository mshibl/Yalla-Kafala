import { Button, Link } from "@mui/material";

const SubmitDonationButton = ({ locale }: { locale: "ar" | "en" }) => {
  return (
    <Link href={`/${locale}/donate`}>
      <Button
        variant="contained"
        sx={{
          marginTop: "20px",
          fontWeight: "bold",
          width: "160px",
          bgcolor: "#ffffff",
          color: "primary.main",
          borderRadius: "39px",
          fontSize: "20px",
          "&:hover": {
            bgcolor: "#ffffff",
          },
        }}
      >
        {locale === "ar" ? "تبرع الآن" : "Donate now"}
      </Button>
    </Link>
  );
};

export default SubmitDonationButton;
