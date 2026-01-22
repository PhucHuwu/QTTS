"use client";

import { useAppStore } from "@/lib/store";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { SystemLog } from "@/types/mock";
import { Badge } from "@/components/ui/badge";

export default function SystemLogsPage() {
    const systemLogs = useAppStore((state) => state.systemLogs);

    const columns: ColumnDef<SystemLog>[] = [
        { accessorKey: "timestamp", header: "Thời gian", cell: ({ row }) => new Date(row.original.timestamp).toLocaleString("vi-VN") },
        { accessorKey: "action", header: "Hành động" },
        { accessorKey: "userName", header: "Người thực hiện" },
        { accessorKey: "details", header: "Chi tiết" },
        {
            accessorKey: "severity",
            header: "Mức độ",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.severity === "ERROR" ? "destructive" : row.original.severity === "WARNING" ? "secondary" : "default"}
                    className={row.original.severity === "INFO" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""}
                >
                    {row.original.severity}
                </Badge>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">Nhật ký hệ thống</h1>
            <div className="rounded-md border p-4">
                <DataTable columns={columns} data={systemLogs} />
            </div>
        </div>
    );
}
