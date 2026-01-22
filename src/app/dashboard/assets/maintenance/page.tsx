"use client";

import { useAppStore } from "@/lib/store";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Hammer, Plus, CheckCircle } from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Asset } from "@/types/mock";

export default function MaintenancePage() {
    const assets = useAppStore((state) => state.assets);
    const updateAsset = useAppStore((state) => state.updateAsset);

    // Filter assets that are BROKEN or MAINTENANCE
    const maintenanceAssets = assets.filter((a) => a.status === "BROKEN" || a.status === "MAINTENANCE");

    const handleFinish = (id: string) => {
        if (confirm("Xác nhận đã hoàn thành bảo trì/sửa chữa?")) {
            updateAsset(id, { status: "ACTIVE" });
        }
    };

    const columns: ColumnDef<Asset>[] = [
        { accessorKey: "code", header: "Mã tài sản" },
        { accessorKey: "name", header: "Tên tài sản" },
        { accessorKey: "location", header: "Vị trí" },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <span className={`font-bold ${status === "BROKEN" ? "text-red-500" : "text-orange-500"}`}>
                        {status === "BROKEN" ? "Hỏng / Sự cố" : "Đang bảo trì"}
                    </span>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleFinish(row.original.id)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Hoàn thành
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Bảo trì & Sửa chữa</h1>
                <Button asChild>
                    <Link href="/dashboard/assets/maintenance/report">
                        <Plus className="mr-2 h-4 w-4" /> Báo hỏng / Yêu cầu BT
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border p-4 bg-muted/20">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Hammer className="h-4 w-4" /> Danh sách tài sản đang xử lý
                </h3>
                <DataTable columns={columns} data={maintenanceAssets} />
            </div>
        </div>
    );
}
