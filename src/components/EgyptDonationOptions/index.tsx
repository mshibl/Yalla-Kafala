import { Card, CardContent, Grid, Typography } from "@mui/material";

const EgyptDonationOptions = ({ locale }: { locale: string }) => {
  return (
    <Grid
      container
      justifyContent="center"
      columns={{ xs: 2, sm: 8, md: 8 }}
      spacing={8}
    >
      <>
        <Grid item width="90%" md={4}>
          <CIB locale={locale} />
        </Grid>
        <Grid item width="90%" md={4}>
          <Fawry locale={locale} />
        </Grid>
        <Grid item width="90%" md={4}>
          <VodafoneCash locale={locale} />
        </Grid>
        <Grid item width="90%" md={4}>
          <Checks locale={locale} />
        </Grid>
      </>
    </Grid>
  );
};

const CIB = ({ locale }: { locale: string }) => (
  <Card sx={{ height: { xs: "300px", lg: "200px" } }} variant="outlined">
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
  <Card sx={{ height: { xs: "300px", lg: "200px" } }} variant="outlined">
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
  <Card sx={{ height: { xs: "300px", lg: "200px" } }} variant="outlined">
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
  <Card sx={{ height: { xs: "300px", lg: "200px" } }} variant="outlined">
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
