"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Hammer, Plus, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Asset, MaintenanceTicket } from "@/types/mock";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

export default function MaintenancePage() {
    const assets = useAppStore((state) => state.assets);
    const maintenanceTickets = useAppStore((state) => state.maintenanceTickets);
    const createMaintenanceTicket = useAppStore((state) => state.createMaintenanceTicket);
    const completeMaintenanceTicket = useAppStore((state) => state.completeMaintenanceTicket);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedAssetId, setSelectedAssetId] = useState("");
    const [description, setDescription] = useState("");

    // Active tickets filter
    const activeTickets = maintenanceTickets.filter((t) => t.status === "PENDING");

    // Assets available for maintenance (not already in maintenance)
    const availableAssets = assets.filter((a) => a.status === "ACTIVE" || a.status === "BROKEN");

    const handleCreate = () => {
        if (!selectedAssetId || !description) return;

        const ticket: MaintenanceTicket = {
            id: `mt-${Date.now()}`,
            assetId: selectedAssetId,
            description,
            requestDate: new Date().toISOString().slice(0, 10),
            status: "PENDING",
        };

        createMaintenanceTicket(ticket);
        setIsCreateOpen(false);
        setSelectedAssetId("");
        setDescription("");
        alert("Đã tạo phiếu bảo trì thành công!");
    };

    const handleFinish = (ticketId: string) => {
        if (confirm("Xác nhận đã hoàn thành bảo trì/sửa chữa?")) {
            completeMaintenanceTicket(ticketId);
        }
    };

    const handleExport = () => {
        const exportData = enrichedData.map((ticket) => ({
            "Mã phiếu": ticket.id,
            "Mã tài sản": ticket.assetCode,
            "Tên tài sản": ticket.assetName,
            "Ngày yêu cầu": ticket.requestDate,
            "Mô tả": ticket.description,
            "Trạng thái": ticket.status,
        }));
        exportToExcel(exportData, `Phieu_bao_tri_${new Date().toISOString().slice(0, 10)}`, "Bảo trì");
    };

    // Enrich ticket data with asset info
    const enrichedData = activeTickets.map((ticket) => {
        const asset = assets.find((a) => a.id === ticket.assetId);
        return {
            ...ticket,
            assetName: asset?.name || "Unknown",
            assetCode: asset?.code || "Unknown",
        };
    });

    const columns: ColumnDef<any>[] = [
        { accessorKey: "assetCode", header: "Mã tài sản" },
        { accessorKey: "assetName", header: "Tên tài sản" },
        { accessorKey: "description", header: "Nội dung sự cố" },
        { accessorKey: "requestDate", header: "Ngày yêu cầu" },
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
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Tạo phiếu bảo trì
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo phiếu bảo trì / báo hỏng</DialogTitle>
                                <DialogDescription>Chọn tài sản và mô tả sự cố để tạo phiếu xử lý.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label>Chọn tài sản</Label>
                                    <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tìm tài sản..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableAssets.map((a) => (
                                                <SelectItem key={a.id} value={a.id}>
                                                    {a.code} - {a.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Mô tả sự cố / Yêu cầu</Label>
                                    <Textarea
                                        placeholder="Ví dụ: Máy không lên nguồn, kẹt giấy..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate} disabled={!selectedAssetId || !description}>
                                    Tạo phiếu
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="rounded-md border p-4 bg-muted/20">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Hammer className="h-4 w-4" /> Danh sách phiếu đang xử lý
                </h3>
                <DataTable columns={columns} data={enrichedData} />
            </div>
        </div>
    );
}
