"use client";
import { Box, Typography, Grid, Button } from "@mui/material";
import { useEffect, useState } from "react";
import BoardModal from "./boardModal";
import BoardMember from "./boardMember";
import { useLocationData } from "@/src/utils/useLocationData";

const Board = ({
  locale,
  boardMembers,
}: {
  locale: string;
  boardMembers: (
    | {
        publish: boolean;
        arabic_bio: string;
        english_bio: string;
        english_name: string;
        arabic_name: string;
        type: string;
        location: string;
        status: string;
        photoLink: string;
      }
    | undefined
  )[];
}) => {
  const [currentMember, setCurrentMember] = useState(0);
  const [open, setOpen] = useState(false);

  const { locationData, loading, error } = useLocationData();
  const [boardFilter, setBoardFilter] = useState("Egypt");
  useEffect(() => {
    if (locationData) {
      setBoardFilter(locationData.country === "US" ? "USA" : "Egypt");
    }
  }, [locationData]);

  if (loading || error || !locationData) return <Box height="500px" />;

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const filteredBoardMembers = boardMembers
    .filter((boardMember) => {
      if (boardMember?.location === "Egypt & USA") return true;
      return boardMember?.location === boardFilter;
    })
    .filter((member) => member?.type === "Board Member");

  const filteredAdvisoryCommittee = boardMembers
    .filter((boardMember) => {
      if (boardMember?.location === "Egypt & USA") return true;
      return boardMember?.location === boardFilter;
    })
    .filter((member) => member?.type === "Advisory Committee");

  return (
    <Box
      sx={{
        paddingX: { xs: "32px" },
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: { xs: "24px", md: "50px" },
            fontWeight: "bold",
            marginBottom: { md: "10px" },
            marginTop: { xs: "20px", md: "60px" },
            lineHeight: "32px",
            color: "primary.main",
          }}
          variant="h2"
        >
          {locale === "en" ? "Our Board Members" : "أعضاء مجلس الإدارة"}
        </Typography>
        <Button
          onClick={() => {
            setCurrentMember(0);
            if (boardFilter === "USA") setBoardFilter("Egypt");
            else setBoardFilter("USA");
          }}
          variant="outlined"
          sx={{
            marginY: { xs: "20px", md: "30px" },
          }}
        >
          {locale === "en"
            ? boardFilter === "USA"
              ? "Show Egypt Board Members"
              : "Show USA Board Members"
            : boardFilter === "USA"
            ? "اظهار اعضاء مجلس ادارة مصر"
            : "اظهار اعضاء مجلس ادارة الولايات المتحدة الأمريكية"}
        </Button>
      </Box>

      <Typography
        sx={{
          fontSize: { xs: "20px", md: "40px" },
          fontWeight: "bold",
          marginBottom: { xs: "10px", md: "35px" },
        }}
        color={"secondary.main"}
        variant="h3"
      >
        {locale === "en"
          ? boardFilter === "USA"
            ? "USA Board Members"
            : "Egypt Board Members"
          : boardFilter === "USA"
          ? "أعضاء مجلس الإدارة في الولايات المتحدة الأمريكية"
          : "أعضاء مجلس الإدارة في مصر"}
      </Typography>
      <Grid gap={10} container>
        {filteredBoardMembers.map((member, index) => {
          if (!member) return null;
          return (
            <BoardMember
              name={locale === "en" ? member.english_name : member.arabic_name}
              image={member.photoLink}
              bio={locale === "en" ? member.english_bio : member.arabic_bio}
              key={index}
              index={index}
              setCurrentMember={setCurrentMember}
              handleOpen={handleOpen}
            />
          );
        })}
      </Grid>

      {filteredAdvisoryCommittee.length !== 0 && (
        <>
          {" "}
          <Typography
            sx={{
              fontSize: { xs: "20px", md: "40px" },
              fontWeight: "bold",
              marginBottom: { xs: "10px", md: "35px" },
            }}
            color={"secondary.main"}
            variant="h3"
          >
            {locale === "en"
              ? boardFilter === "USA"
                ? "USA Advisory Committee"
                : "Egypt Advisory Committee"
              : boardFilter === "USA"
              ? "أعضاء اللجنة الاستشارية في الولايات المتحدة الأمريكية"
              : "أعضاء اللجنة الاستشارية في مصر"}
          </Typography>
          <Grid gap={10} container>
            {filteredAdvisoryCommittee.map((member, index) => {
              if (!member) return null;
              return (
                <BoardMember
                  name={
                    locale === "en" ? member.english_name : member.arabic_name
                  }
                  image={member.photoLink}
                  bio={locale === "en" ? member.english_bio : member.arabic_bio}
                  key={index}
                  index={index}
                  setCurrentMember={setCurrentMember}
                  handleOpen={handleOpen}
                />
              );
            })}
          </Grid>
        </>
      )}

      <BoardModal
        currentMember={currentMember}
        open={open}
        handleClose={handleClose}
        setCurrentMember={setCurrentMember}
        locale={locale}
        boardMembers={boardMembers}
      />
    </Box>
  );
};

export default Board;
