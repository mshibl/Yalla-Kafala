import { ArrowBack, ArrowForward, Close } from "@mui/icons-material";
import { Modal, Box, IconButton, Typography } from "@mui/material";
import Image from "next/image";

const BoardModal = ({
  currentMember = 0,
  open,
  handleClose,
  setCurrentMember,
  boardMembers,
  locale,
}: {
  currentMember: number;
  open: boolean;
  handleClose: () => void;
  setCurrentMember: (index: number) => void;
  boardMembers: (
    | {
        publish: boolean;
        arabic_bio: string;
        english_bio: string;
        english_name: string;
        arabic_name: string;
        location: string;
        status: string;
        photoLink: string;
      }
    | undefined
  )[];
  locale: string;
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "370px", md: "1000px" },
          height: "80%",
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          outline: "none",
          paddingX: { xs: "20px", md: "80px" },
          paddingY: { xs: "16px", md: "34px" },
          overflow: "scroll",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
            }}
          >
            <IconButton
              onClick={() => {
                if (currentMember > 0) setCurrentMember(currentMember - 1);
              }}
              sx={{
                marginX: "12px",
                backgroundColor: "#EEF1F4",
              }}
            >
              {locale === "en" ? <ArrowBack /> : <ArrowForward />}
            </IconButton>
            <IconButton
              onClick={() => {
                if (currentMember < boardMembers.length - 1)
                  setCurrentMember(currentMember + 1);
              }}
              sx={{
                backgroundColor: "#EEF1F4",
                marginX: "12px",
              }}
            >
              {locale === "en" ? <ArrowForward /> : <ArrowBack />}{" "}
            </IconButton>
          </Box>
          <Box>
            <IconButton
              onClick={() => {
                handleClose();
              }}
              sx={{
                marginX: "12px",
                backgroundColor: "#EEF1F4",
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            marginTop: "24px",
          }}
        >
          <Box
            sx={{
              width: { xs: "160px", md: "auto" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#B9D7E0",
              paddingX: { xs: "30px", md: "50px" },
              paddingY: { xs: "10px", md: "12px" },
              marginRight: locale === "en" ? { xs: "24px", md: "40px" } : "",
              marginLeft: locale === "ar" ? { xs: "24px", md: "40px" } : "",
            }}
            component={"img"}
            src={
              boardMembers[currentMember]!.photoLink
                ? boardMembers[currentMember]!.photoLink
                : "/images/profile-picture-placeholder.svg"
            }
          />
          <Box>
            <Typography
              sx={{
                textAlign: "start",
                fontSize: { xs: "18px", md: "24px" },
                color: "primary.main",
                fontWeight: "bold",
              }}
            >
              {locale === "en"
                ? boardMembers[currentMember]!.english_name
                : boardMembers[currentMember]!.arabic_name}
            </Typography>
            {/* <Typography
              sx={{
                textAlign: "start",
                width: "100%",
                fontSize: { xs: "16px", md: "24px" },
              }}
            >
              {locale === "en"
                ? boardMembers[currentMember].titleEn
                : boardMembers[currentMember].titleAr}
            </Typography> */}
          </Box>
        </Box>
        <Typography
          sx={{
            textAlign: "start",
            fontSize: { xs: "18px", md: "24px" },
            color: "primary.main",
            fontWeight: "bold",
            marginTop: "24px",
          }}
        >
          {locale === "en" ? "Bio:" : "السيرة الذاتية:"}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {locale === "en"
            ? boardMembers[currentMember]!.english_bio
            : boardMembers[currentMember]!.arabic_bio}
        </Typography>
      </Box>
    </Modal>
  );
};
export default BoardModal;
