import { useQuery } from "@tanstack/react-query";

export function useRegionsQuery() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REST_API}/region/`
      );
      if (!response.ok) throw new Error("Failed to fetch regions");
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCitiesByRegionQuery(regionId: number | undefined) {
  return useQuery({
    queryKey: ["cities", regionId],
    queryFn: async () => {
      if (!regionId) return [];
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REST_API}/region/${regionId}/cities`
      );
      if (!response.ok) throw new Error("Failed to fetch cities");
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!regionId,
  });
}

export function useSensorsByCityQuery(cityId: number, isOpen: boolean) {
  return useQuery({
    queryKey: ["sensors", cityId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REST_API}/region/city/${cityId}/with-sensors`
      );
      if (!response.ok) throw new Error("Failed to fetch sensors");
      return response.json();
    },
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });
}
