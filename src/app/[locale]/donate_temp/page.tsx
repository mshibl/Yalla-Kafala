"use client";

import PublicIcon from "@mui/icons-material/Public";
import ETapestryDonationForm from "@/src/components/ETapestryDonationForm";
import EgyptDonationOptions from "@/src/components/EgyptDonationOptions";
import ErrorBoundary from "@/src/components/ErrorBoundary";
import { useLocationData } from "@/src/utils/useLocationData";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import useResponsiveBreakpoint from "@/src/utils/mui-utils";
import { useState } from "react";
import HeroImage from "@/src/components/aboutUs/WhoWeAre/heroImage";

const DonatePage = ({
  params: { locale },
}: {
  params: { locale: "ar" | "en" };
}) => {
  const { locationData, loading, error } = useLocationData();
  const [showEtapestry, setShowEtapestry] = useState(false);

  if (loading || error || !locationData) return <Box height="500px" />;

  const country = locationData?.country.toLowerCase();

  return (
    <ErrorBoundary locale={locale}>
      <HeroImage src="/images/donation_page_hero.png" />
      <Box
        sx={{
          marginX: "25%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "24px", md: "45px" },
            fontWeight: "bold",
            marginTop: { xs: "20px", md: "20px" },
            lineHeight: { xs: "32px", md: "61px" },
            color: "primary.main",
          }}
          variant="h2"
        >
          {locale === "en" ? "Transform Lives:" : "قصتنا"}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "24px", md: "45px" },
            fontWeight: "bold",
            marginBottom: { xs: "10px", md: "20px" },
            lineHeight: { xs: "32px", md: "61px" },
            color: "secondary.main",
          }}
          variant="h2"
        >
          {locale === "en" ? "Your Donations, Their Hope" : "قصتنا"}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "16px", md: "24px" },
            lineHeight: { xs: "25px", md: "32px" },
          }}
          variant="body1"
        >
          {locale === "en" ? (
            <>
              Every child deserves a chance to dream, to thrive, to be loved.
              Your donation has the power to make this come true. It's more than
              a gift; it's a lifeline. It's a chance to provide food, shelter,
              education, and hope. It's a chance to rewrite the story of a
              child's life. 
            </>
          ) : (
            <>
              يلا كفالة هي منظمة غير حكومية رائدة تأسست في عام 2020، مكرسة
              لإعادة تشكيل رعاية الأطفال في مصر من خلال خيارات الرعاية البديلة
              والكفالة (الوصاية / التبني). <br /> <br /> إلهامًا من رحلة مؤسسنا
              رشا مكي الشخصية وكفالتها لابنها مصطفى، أطلقنا أول موقع ويب مخصص
              للكفالة في مصر وأسسنا يلا كفالة. <br /> <br /> بمقرات رئيسية في
              مصر وسان فرانسيسكو، نحن نسعى لتوفير بيئات منزلية مغذية للأيتام من
              خلال بدائل الرعاية الابتكارية وخدمات الدعم والدعوة.
            </>
          )}
        </Typography>
        <Box
          component={"form"}
          sx={{
            marginY: { xs: "25px", md: "40px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            component={"label"}
            sx={{
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            First Name
          </Box>
          <TextField
            fullWidth
            id="outlined-basic"
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
          <Box
            component={"label"}
            sx={{
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            Last Name
          </Box>
          <TextField
            fullWidth
            id="outlined-basic"
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
          <Box
            component={"label"}
            sx={{
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            Email
          </Box>
          <TextField
            fullWidth
            id="outlined-basic"
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
          <Box
            component={"label"}
            sx={{
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            Phone
          </Box>
          <TextField
            fullWidth
            id="outlined-basic"
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
          <Box
            component={"h3"}
            sx={{
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            Which program do you want to contribute to?
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <FormControlLabel
              sx={{
                color: "primary.main",
              }}
              control={
                <Checkbox
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
              label="Education Initiatives"
            />
            <FormControlLabel
              sx={{
                color: "primary.main",
              }}
              control={
                <Checkbox
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
              label="Advocacy Initiatives"
            />
            <FormControlLabel
              sx={{
                color: "primary.main",
              }}
              control={
                <Checkbox
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
              label="Resource Development Initiatives"
            />
            <FormControlLabel
              sx={{
                color: "primary.main",
              }}
              control={
                <Checkbox
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
              label="Yalla Kafala Admin/operations"
            />
          </Box>
          <Button
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
            Next
          </Button>
        </Box>
      </Box>
      <EgyptDonationOptions locale={locale} />
    </ErrorBoundary>
  );
};

export default DonatePage;
