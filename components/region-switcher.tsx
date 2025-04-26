"use client";

import { useState, useEffect } from "react";
import {
  ChevronsUpDown,
  GalleryVerticalEnd,
  Plus,
  Loader2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function RegionSwitcher() {
  const { isMobile } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regions, setRegions] = useState<
    {
      id: number;
      name: string;
      state: string;
      emblem_url: string | null;
    }[]
  >([]);
  const [activeRegion, setActiveRegion] = useState<{
    id: number;
    name: string;
    state: string;
    emblem_url: string | null;
  } | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/region/`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setRegions(data);

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
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="ml-2">Loading regions...</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (error || !activeRegion) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="text-red-500">
            <span>{error || "No regions available"}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {activeRegion.emblem_url ? (
                  <img
                    src={activeRegion.emblem_url!}
                    className="size-4"
                    alt={`${activeRegion.name} emblem`}
                  />
                ) : (
                  <GalleryVerticalEnd className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeRegion.name}
                </span>
                <span className="truncate text-xs">{activeRegion.state}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              regions
            </DropdownMenuLabel>
            {regions.map((region, index) => (
              <DropdownMenuItem
                key={region.name}
                onClick={() => setActiveRegion(region)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {region.emblem_url ? (
                    <img
                      src={region.emblem_url!}
                      className="size-4 shrink-0"
                      alt={`${region.name} emblem`}
                    />
                  ) : (
                    <GalleryVerticalEnd className="size-4 shrink-0" />
                  )}
                </div>
                {region.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add region
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
