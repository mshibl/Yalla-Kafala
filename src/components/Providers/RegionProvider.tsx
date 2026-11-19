"use client";
import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { Region } from "@/lib/region";

const RegionContext = createContext<Region | undefined>(undefined);

export const RegionProvider = ({
  region,
  children,
}: {
  region: Region;
  children: ReactNode;
}) => (
  <RegionContext.Provider value={region}>{children}</RegionContext.Provider>
);

export function useRegion(): Region {
  const region = useContext(RegionContext);
  if (!region) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return region;
}
