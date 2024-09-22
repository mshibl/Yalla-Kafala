import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, SxProps } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function StoryCard({
  locale,
  story,
}: {
  locale: string;
  story: any;
}) {
  return (
    <Card sx={{ height: "100%" }}>
      <Link href={`/${locale}/kafala_stories/${story.id}`}>
        <Box display="flex" height="100%">
          <Button sx={{ textAlign: "initial", p: 0 }}>
            <Box
              position="relative"
              textAlign="center"
              height={240}
              width={240}
              minHeight="100%"
              display="flex"
              alignSelf="center"
            >
              <Image
                fill={true}
                style={{ objectFit: "cover", minHeight: "100%" }}
                src={story.image_link}
                alt={locale === "ar" ? story.arabic_title : story.english_title}
                sizes="100% 100%"
              />
            </Box>
          </Button>
          <Box flexBasis="70%">
            <CardContent>
              <Typography
                gutterBottom
                variant="body1"
                fontWeight={600}
                fontSize="18px"
                component="div"
              >
                {locale === "ar" ? story.arabic_title : story.english_title}
              </Typography>
              <Typography
                fontSize="1.2rem"
                color="text.secondary"
                sx={{
                  WebkitLineClamp: 4,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {locale === "ar"
                  ? story.arabic_description
                  : story.english_description}
              </Typography>
              <Button size="small">
                {locale === "ar" ? "اقرأ الحكاية" : "Read the story"}
              </Button>
            </CardContent>
          </Box>
        </Box>
      </Link>
    </Card>
  );
}
