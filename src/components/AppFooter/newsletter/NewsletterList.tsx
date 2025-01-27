import Grid from "@mui/material/Grid";
import NewsletterFormContainer from "./NewsletterFormContainer";
import SocialMediaList from "./SocialMediaList";
import GuideStarBadge from "./GuideStarBadge";

const NewsletterList = () => {
  return (
    <>
      <Grid
        container
        justifyContent="flex-start"
        direction={"column"}
        item
        xs={12}
        md={4}
      >
        {/* <NewsletterFormContainer /> */}
        <SocialMediaList />
        <GuideStarBadge />
      </Grid>
    </>
  );
};

export default NewsletterList;
