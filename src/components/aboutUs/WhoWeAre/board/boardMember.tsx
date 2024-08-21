import { Grid, Box, Typography } from "@mui/material";
import Image from "next/image";

const BoardMember = ({
  name,
  // title,
  image,
  index,
  setCurrentMember,
  handleOpen,
}: {
  name: string;
  // title: string;
  image: string | null;
  bio: string;
  index: number;
  setCurrentMember: (index: number) => void;
  handleOpen: () => void;
}) => {
  return (
    <Grid
      item
      onClick={() => {
        setCurrentMember(index);
        handleOpen();
      }}
      xs={5.5}
      md={2.5}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "160px", md: "250px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#B9D7E0",
          paddingX: { xs: "30px", md: "50px" },
          paddingY: { xs: "10px", md: "12px" },
        }}
      >
        <Image
          fill={true}
          objectFit="contain"
          // width={200}
          // height={230}
          alt={name || "Board member"}
          src={image ? image : "/images/profile-picture-placeholder.svg"}
        />
      </Box>
      <Typography
        sx={{
          textAlign: "start",
          width: "100%",
          fontSize: { xs: "18px", md: "24px" },
          color: "primary.main",
          fontWeight: "bold",
        }}
      >
        {name}
      </Typography>
      {/* <Typography
        sx={{
          textAlign: "start",
          width: "100%",
          fontSize: { xs: "16px", md: "24px" },
        }}
      >
        {title}
      </Typography> */}
    </Grid>
  );
};
export default BoardMember;
