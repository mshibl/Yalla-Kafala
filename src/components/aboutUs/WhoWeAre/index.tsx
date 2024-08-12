import React from "react";
import HeroImage from "./heroImage";
import Story from "./story";
import HelpChildrenAndFamilies from "../helpChildrenAndFamilies";
import Initiatives from "./initiatives";
import YallaKafalaBeginning from "./beginning";
import Founder from "./founder";
import Board from "./board";
import { fetchBoardMembers } from "@/src/utils/fetch-board-members";

const WhoWeAre = async ({ locale }: { locale: string }) => {
  const boardMembers = await fetchBoardMembers();

  return (
    <>
      <HeroImage />
      <Story locale={locale} />
      <Founder locale={locale} />
      <Board boardMembers={boardMembers} locale={locale} />
      <YallaKafalaBeginning locale={locale} />
      <Initiatives locale={locale} />
      <HelpChildrenAndFamilies locale={locale} />
    </>
  );
};

export default WhoWeAre;
