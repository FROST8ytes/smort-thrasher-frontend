"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Region = {
  id: number;
  name: string;
  state: string;
  emblem_url: string | null;
};

type RegionContextType = {
  activeRegion: Region | null;
  setActiveRegion: (region: Region | null) => void;
  regions: Region[];
  isLoading: boolean;
  error: string | null;
};

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function useRegionContext() {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error("useRegionContext must be used within a RegionProvider");
  }
  return context;
}

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [activeRegion, setActiveRegion] = useState<Region | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://smort-thrasher-backend-1063382714333.asia-southeast1.run.app/region/"
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setRegions(data);

        // Set active region to the first region in the list
        if (data.length > 0) {
          setActiveRegion(data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch regions:", err);
        setError("Failed to load regions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegions();
  }, []);

  return (
    <RegionContext.Provider
      value={{ activeRegion, setActiveRegion, regions, isLoading, error }}
    >
      {children}
    </RegionContext.Provider>
  );
}
