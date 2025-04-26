"use client";

import { useEffect, useState } from "react";
import {
  ChevronRight,
  MapPin,
  type LucideIcon,
  Thermometer,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useRegionContext } from "@/lib/region-context";

interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  region_id: number;
}

interface Sensor {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  city_id: number;
}

interface CityWithSensors {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  region_id: number;
  sensors: Sensor[];
}

export function NavMain() {
  const { activeRegion } = useRegionContext();
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityWithSensorsMap, setCityWithSensorsMap] = useState<
    Record<number, Sensor[]>
  >({});
  const [loadingSensorMap, setLoadingSensorMap] = useState<
    Record<number, boolean>
  >({});

  // Fetch cities when activeRegion changes
  useEffect(() => {
    if (!activeRegion) return;

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/region/${activeRegion.id}/cities`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [activeRegion]);

  // Fetch sensors for a city when opened
  const handleCityToggle = async (cityId: number, isOpen: boolean) => {
    if (!isOpen || cityWithSensorsMap[cityId]) return;

    setLoadingSensorMap((prev) => ({ ...prev, [cityId]: true }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REST_API}/region/city/${cityId}/with-sensors`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: CityWithSensors = await response.json();
      setCityWithSensorsMap((prev) => ({
        ...prev,
        [cityId]: data.sensors,
      }));
    } catch (error) {
      console.error(`Failed to fetch sensors for city ${cityId}:`, error);
    } finally {
      setLoadingSensorMap((prev) => ({ ...prev, [cityId]: false }));
    }
  };

  if (!activeRegion) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Cities</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <span>Please select a region</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Cities in {activeRegion.name}</SidebarGroupLabel>
      <SidebarMenu>
        {loadingCities ? (
          <SidebarMenuItem>
            <SidebarMenuButton>
              <span>Loading cities...</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : cities.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton>
              <span>No cities found</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          cities.map((city) => (
            <Collapsible
              key={city.id}
              asChild
              defaultOpen={false}
              className="group/collapsible"
              onOpenChange={(isOpen) => handleCityToggle(city.id, isOpen)}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={city.name}>
                    <MapPin className="h-4 w-4" />
                    <span>{city.name}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {loadingSensorMap[city.id] ? (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>
                          <span>Loading sensors...</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ) : cityWithSensorsMap[city.id]?.length > 0 ? (
                      cityWithSensorsMap[city.id].map((sensor) => (
                        <SidebarMenuSubItem key={sensor.id}>
                          <SidebarMenuSubButton asChild>
                            <a href={`/sensor/${sensor.id}`}>
                              <Thermometer className="h-3 w-3 mr-2" />
                              <span>{sensor.name}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))
                    ) : (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>
                          <span>No sensors found</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
