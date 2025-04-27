"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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

// Define types for the sensor records
interface SensorRecord {
  id: number;
  sensor_id: number;
  timestamp: string;
  trash_level: number;
  image: string | null;
}

export default function SensorDetailsPage({
  params,
}: {
  params: { sensor_id: string };
}) {
  const [records, setRecords] = useState<SensorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sensorName, setSensorName] = useState<string>("");

  // Define table columns
  const columns: ColumnDef<SensorRecord>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }) => {
        console.log(row);
        const timestamp = row.getValue("timestamp") as string;
        console.log(timestamp);

        try {
          return new Date(timestamp).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZoneName: "short",
          });
        } catch (error) {
          console.error("Failed to parse date:", timestamp, error);
          return timestamp || "Unknown date"; // Fallback to raw string
        }
      },
    },
    {
      accessorKey: "trash_level",
      header: "Trash Level",
      cell: ({ row }) => {
        const level = row.getValue("trash_level") as number;
        return (
          <div className="flex items-center">
            <div className="w-full bg-muted rounded-full h-2.5 mr-2">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${level}%` }}
              ></div>
            </div>
            <span>{level}%</span>
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

  // Initialize the table
  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    async function fetchSensorDetails() {
      try {
        // First fetch basic sensor info to get the name
        const sensorResponse = await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/sensor/${params.sensor_id}`
        );

        if (!sensorResponse.ok) {
          throw new Error(`API error: ${sensorResponse.status}`);
        }

        const sensorData = await sensorResponse.json();
        setSensorName(sensorData.name);
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

  return (
    <div className="container p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {sensorName ? `Sensor: ${sensorName}` : `Sensor #${params.sensor_id}`}
        </h1>
      </div>

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
    </div>
  );
}
