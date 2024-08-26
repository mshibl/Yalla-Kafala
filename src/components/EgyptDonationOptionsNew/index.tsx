import { Card, CardContent, Grid, Typography, Box } from "@mui/material";

const EgyptDonationOptions = ({ locale }: { locale: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "secondary.main",
        paddingBottom: { xs: "30px", md: "100px" },
        paddingTop: "25px",
        justifyContent: "center",
        alignItems: "center",
        paddingX: { xs: "30px" },
      }}
    >
      <Box
        sx={{
          width: { xs: "36px", md: "66px" },
          height: { xs: "36px", md: "66px" },
          borderRadius: "50%",
          backgroundColor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "30px",
          marginBottom: { xs: "10px", md: "25px" },
        }}
      >
        <Typography fontWeight={"bold"} variant="body1">
          {locale === "en" ? "or" : "او"}
        </Typography>
      </Box>
      <Grid
        container
        justifyContent="center"
        columns={{ xs: 2, sm: 8, md: 8 }}
        // spacing={8}
        sx={{
          overflow: "hidden",
          width: "100%",
        }}
      >
        <>
          <Grid item xs={12} md={3}>
            <CIB locale={locale} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Fawry locale={locale} />
          </Grid>
          <Grid item xs={12} md={3}>
            <VodafoneCash locale={locale} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Checks locale={locale} />
          </Grid>
        </>
      </Grid>
    </Box>
  );
};

const CIB = ({ locale }: { locale: string }) => (
  <Card sx={{ height: "250px", margin: "8px" }} variant="outlined">
    <CardContent>
      <Typography
        color="text.primary"
        gutterBottom
        variant="h6"
        fontWeight={600}
      >
        {locale === "ar" ? "تحويل بنكي" : "Bank Transfer"}
      </Typography>

      <ul>
        <li>{locale === "ar" ? "بنك CIB" : "CIB Bank"}</li>
        <li>
          {locale === "ar"
            ? "الاسم: Yalla Kafala for Charity"
            : "Name: Yalla Kafala for Charity"}
        </li>
        <li>
          {locale === "ar"
            ? "رقم الحساب: 100053734857"
            : "Account Number: 100053734857"}
        </li>
      </ul>
    </CardContent>
  </Card>
);

const Fawry = ({ locale }: { locale: string }) => (
  <Card sx={{ height: "250px", margin: "8px" }} variant="outlined">
    <CardContent>
      <Typography
        color="text.primary"
        gutterBottom
        variant="h6"
        fontWeight={600}
      >
        {locale === "ar" ? "فوري" : "Fawry"}
      </Typography>
      <ul>
        <li>{locale === "ar" ? "قم بفتح تطبيق فوري" : "Open the Fawry app"}</li>
        <li>
          {locale === "ar" ? "افتح صفحة التبرعات" : "Open the donations page"}
        </li>
        <li>
          {locale === "ar"
            ? "ابحث عن Yalla Kafala Foundation"
            : "Search for Yalla Kafala Foundation"}
        </li>
      </ul>
    </CardContent>
  </Card>
);

const Checks = ({ locale }: { locale: string }) => (
  <Card sx={{ height: "250px", margin: "8px" }} variant="outlined">
    <CardContent>
      <Typography
        color="text.primary"
        gutterBottom
        variant="h6"
        fontWeight={600}
      >
        {locale === "ar" ? "شيكات" : "Checks"}
      </Typography>
      <Typography variant="body2">
        {locale === "ar" ? "يمكن إرسال الشيكات إلى:" : "Checks can be sent to"}
        <br />
        {locale === "ar"
          ? "يلا كفالة ٢٤ اللاسلكي الصغير، المعادي الجديدة"
          : "Yalla Kafala 24 El Lasilki ElSagheer, New Maadi"}
      </Typography>
    </CardContent>
  </Card>
);

const VodafoneCash = ({ locale }: { locale: string }) => (
  <Card sx={{ height: "250px", margin: "8px" }} variant="outlined">
    <CardContent>
      <Typography
        color="text.primary"
        gutterBottom
        variant="h6"
        fontWeight={600}
      >
        {locale === "ar" ? "فودافون كاش" : "Vodafone Cash"}
      </Typography>
      <ul>
        <li>{locale === "ar" ? "قم بفتح تطبيق فوري" : "Open Vodafone Cash"}</li>
        <li>
          {locale === "ar" ? "افتح صفحة التبرعات" : "Open the donations tab"}
        </li>
        <li>
          {locale === "ar"
            ? "ابحث عن Yalla Kafala for Charity"
            : "Search for Yalla Kafala for Charity"}
        </li>
      </ul>
    </CardContent>
  </Card>
);

export default EgyptDonationOptions;
