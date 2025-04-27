"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import Map, { Source, Layer } from "react-map-gl/mapbox";
import { useRegionContext } from "@/lib/region-context";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface SensorData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface AverageData {
  sensor_id: number;
  average_value: number;
}

interface HeatmapFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    weight: number;
  };
}

const heatmapLayer = {
  id: "heatmap-layer",
  type: "heatmap",
  paint: {
    "heatmap-weight": ["get", "weight"],
    "heatmap-intensity": 1,
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(33,102,172,0)",
      0.2,
      "rgb(103,169,207)",
      0.4,
      "rgb(209,229,240)",
      0.6,
      "rgb(253,219,199)",
      0.8,
      "rgb(239,138,98)",
      1,
      "rgb(178,24,43)",
    ],
    "heatmap-radius": 20,
    "heatmap-opacity": 0.8,
  },
};

export default function MapHeatmap() {
  const { resolvedTheme } = useTheme();
  const { activeRegion } = useRegionContext();
  const [viewState, setViewState] = useState({
    longitude: -122.443,
    latitude: 37.787,
    zoom: 14,
  });
  const [heatmapData, setHeatmapData] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHeatmapData() {
      if (!activeRegion) return;

      setIsLoading(true);
      setError(null);

      try {
        const averageResponse = await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/analytics/average/${activeRegion.id}`
        );

        if (!averageResponse.ok) {
          throw new Error(`API error: ${averageResponse.status}`);
        }

        const averageData: AverageData[] = await averageResponse.json();

        const sensorPromises = averageData.map((data) =>
          fetch(`${process.env.NEXT_PUBLIC_REST_API}/sensor/${data.sensor_id}`)
            .then((res) => {
              if (!res.ok) throw new Error(`Sensor API error: ${res.status}`);
              return res.json();
            })
            .then((sensorData: SensorData) => ({
              sensorData,
              averageValue: data.average_value,
            }))
        );

        const sensorsWithData = await Promise.all(sensorPromises);

        const features: HeatmapFeature[] = sensorsWithData.map(
          ({ sensorData, averageValue }) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [sensorData.longitude, sensorData.latitude],
            },
            properties: {
              weight: averageValue,
            },
          })
        );

        setHeatmapData({
          type: "FeatureCollection",
          features,
        });

        if (features.length > 0) {
          const [longitude, latitude] = features[0].geometry.coordinates;
          setViewState((prev) => ({
            ...prev,
            longitude,
            latitude,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch heatmap data:", err);
        setError("Failed to load heatmap data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchHeatmapData();
  }, [activeRegion]);

  const mapStyle =
    resolvedTheme === "dark"
      ? "mapbox://styles/mapbox/dark-v11"
      : "mapbox://styles/mapbox/light-v11";

  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="text-destructive text-sm">{error}</div>
        </div>
      )}

      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle={mapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
      >
        {/* @ts-ignore */}
        <Source type="geojson" data={heatmapData}>
          {/* @ts-ignore */}
          <Layer {...heatmapLayer} />
        </Source>
      </Map>
    </div>
  );
}
