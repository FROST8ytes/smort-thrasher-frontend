"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin, LineChart } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTheme } from "next-themes";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

dayjs.extend(relativeTime);

interface SensorRecord {
  id: number;
  sensor_id: number;
  timestamp: string;
  trash_level: number;
  image: string | null;
}

interface SensorPrediction {
  sensor_id: number;
  predicted_timestamp: string;
  hours_until_full: number;
  predicted_level: number;
}

export default function SensorDetailsPage({
  params,
}: {
  params: { sensor_id: string };
}) {
  const { resolvedTheme } = useTheme();
  const [records, setRecords] = useState<SensorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sensorName, setSensorName] = useState<string>("");
  const [sensorLocation, setSensorLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [isPredicting, setIsPredicting] = useState(false);
  const [showPredictionDialog, setShowPredictionDialog] = useState(false);
  const [predictionData, setPredictionData] = useState<SensorPrediction | null>(
    null
  );
  const [predictionError, setPredictionError] = useState<string | null>(null);

  const mapStyle =
    resolvedTheme === "dark"
      ? "mapbox://styles/mapbox/dark-v11"
      : "mapbox://styles/mapbox/light-v11";

  const columns: ColumnDef<SensorRecord>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }) => {
        const timestamp = row.getValue("timestamp") as string;

        if (!timestamp) return "Unknown date";

        try {
          const date = dayjs(timestamp);

          return (
            <div>
              <div>{date.format("MMM D, YYYY h:mm A")}</div>
              <div className="text-xs text-muted-foreground">
                {date.fromNow()}
              </div>
            </div>
          );
        } catch (error) {
          console.error("Failed to parse date:", timestamp, error);
          return timestamp || "Unknown date";
        }
      },
    },
    {
      accessorKey: "trash_level",
      header: "Trash Level",
      size: 350,
      cell: ({ row }) => {
        const level = row.getValue("trash_level") as number;
        return (
          <div className="flex items-center w-full">
            <div className="w-full bg-muted rounded-full h-2.5 mr-2">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${level}%` }}
              ></div>
            </div>
            <span className="whitespace-nowrap">{level}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const image = row.getValue("image") as string | null;
        return image ? (
          <a
            href={image}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            View
          </a>
        ) : (
          <span className="text-muted-foreground">None</span>
        );
      },
    },
  ];

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    async function fetchSensorDetails() {
      try {
        const sensorResponse = await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/sensor/${params.sensor_id}`
        );

        if (!sensorResponse.ok) {
          throw new Error(`API error: ${sensorResponse.status}`);
        }

        const sensorData = await sensorResponse.json();
        setSensorName(sensorData.name);

        if (sensorData.latitude && sensorData.longitude) {
          setSensorLocation({
            latitude: sensorData.latitude,
            longitude: sensorData.longitude,
          });
        }
      } catch (err) {
        console.error("Failed to fetch sensor details:", err);
        setError("Failed to load sensor details");
      }
    }

    async function fetchSensorRecords() {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/sensor/${params.sensor_id}/latest-records?limit=10`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setRecords(data);
      } catch (err) {
        console.error("Failed to fetch sensor records:", err);
        setError("Failed to load sensor records");
      } finally {
        setLoading(false);
      }
    }

    fetchSensorDetails();
    fetchSensorRecords();
  }, [params.sensor_id]);

  async function fetchPrediction() {
    try {
      setIsPredicting(true);
      setPredictionError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REST_API}/predict/${params.sensor_id}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setPredictionData(data);
      setShowPredictionDialog(true);
    } catch (err) {
      console.error("Failed to fetch prediction:", err);
      setPredictionError(
        err instanceof Error ? err.message : "Failed to get prediction"
      );
      setShowPredictionDialog(true);
    } finally {
      setIsPredicting(false);
    }
  }

  return (
    <div className="container p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {sensorName ? `Sensor: ${sensorName}` : `Sensor #${params.sensor_id}`}
        </h1>
        <Button
          onClick={fetchPrediction}
          disabled={isPredicting}
          className="flex items-center gap-2"
        >
          {isPredicting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Predicting...
            </>
          ) : (
            <>
              <LineChart className="h-4 w-4" />
              Get Prediction
            </>
          )}
        </Button>
      </div>

      {sensorLocation && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Location</h2>
          <div className="rounded-xl overflow-hidden h-[300px]">
            <Map
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              initialViewState={{
                longitude: sensorLocation.longitude,
                latitude: sensorLocation.latitude,
                zoom: 14,
              }}
              mapStyle={mapStyle}
              style={{ width: "100%", height: "100%" }}
            >
              <Marker
                longitude={sensorLocation.longitude}
                latitude={sensorLocation.latitude}
                anchor="bottom"
              >
                <MapPin className="h-8 w-8 text-primary" />
              </Marker>
            </Map>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Latest Records</h2>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="rounded-md bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-md bg-muted p-4 text-muted-foreground">
            No records found for this sensor.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Prediction Alert Dialog */}
      <AlertDialog
        open={showPredictionDialog}
        onOpenChange={setShowPredictionDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {predictionError ? "Prediction Error" : "Trash Level Prediction"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {predictionError ? (
                <div className="text-destructive">{predictionError}</div>
              ) : predictionData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Predicted Level
                      </p>
                      <p className="text-2xl font-bold">
                        {predictionData.predicted_level}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Hours Until Full
                      </p>
                      <p className="text-2xl font-bold">
                        {predictionData.hours_until_full.toFixed(1)} hrs
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Predicted Full At
                    </p>
                    <p className="text-base">
                      {dayjs(predictionData.predicted_timestamp).format(
                        "MMM D, YYYY h:mm A"
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dayjs(predictionData.predicted_timestamp).fromNow()}
                    </p>
                  </div>

                  <div className="w-full mt-2">
                    <div className="w-full bg-muted rounded-full h-4">
                      <div
                        className="bg-primary h-4 rounded-full"
                        style={{ width: `${predictionData.predicted_level}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                "Loading prediction data..."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
