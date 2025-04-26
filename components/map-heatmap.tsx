"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import Map, { Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const heatmapData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-122.447, 37.782] },
      properties: { weight: 3 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-122.445, 37.785] },
      properties: { weight: 2 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-122.441, 37.788] },
      properties: { weight: 5 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-122.439, 37.79] },
      properties: { weight: 7 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-122.437, 37.792] },
      properties: { weight: 4 },
    },
  ],
};

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
  const [viewState, setViewState] = useState({
    longitude: -122.443,
    latitude: 37.787,
    zoom: 14,
  });

  const mapStyle =
    resolvedTheme === "dark"
      ? "mapbox://styles/mapbox/dark-v11"
      : "mapbox://styles/mapbox/light-v11";

  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
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
