import { Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Grid from "@mui/material/Grid";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { formatText } from "@/src/utils/string-utils";

interface FaqProps {
  question: string;
  answer: string;
  defaultExpanded: boolean;
}

const Faq: React.FC<FaqProps> = ({ defaultExpanded, question, answer }) => {
  return (
    <Grid item xs={12} md={10}>
      <Accordion
        defaultExpanded={defaultExpanded}
        sx={{
          boxShadow: "0 5px 20px rgba(0,0,0,.1)",
          padding: "5px 10px 5px 20px",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography color="primary.main" fontSize="1.2rem" fontWeight={600}>
            {question}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="black" fontSize="1.2rem" overflow="hidden">
            {formatText(answer)}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default Faq;
