import Grid from "@mui/material/Grid";
import QuickLinksList from "./quickLinks/QuickLinksList";
import ContactList from "./contact/ContactList";
import CopyrightStatement from "./CopyrightStatement";
import SocialMediaList from "./newsletter/SocialMediaList";
import GuideStarBadge from "./newsletter/GuideStarBadge";

const AppFooter: React.FC = () => {
  return (
    <Grid
      container
      sx={{
        bgcolor: "primary.main",
        color: "#ffffff",
        px: { xs: 20, md: 45 },
        pt: { xs: 17, md: 34 },
        pb: { xs: 10, md: 15 },
      }}
    >
      <QuickLinksList />
      <ContactList />
      <Grid
        container
        item
        sx={{ mb: { xs: 30, md: 0 } }}
        direction={"column"}
        xs={12}
        md={4}
      >
        {/* <NewsletterList /> */}
        <SocialMediaList />
        <GuideStarBadge />
      </Grid>
      <CopyrightStatement />
    </Grid>
  );
};

export default AppFooter;
