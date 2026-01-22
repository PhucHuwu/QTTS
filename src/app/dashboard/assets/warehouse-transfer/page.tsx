"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Warehouse, Plus, Download, ArrowRightLeft } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

interface WarehouseTransfer {
    id: string;
    transferCode: string;
    fromWarehouse: string;
    toWarehouse: string;
    assetCount: number;
    status: "PENDING" | "IN_TRANSIT" | "COMPLETED";
    requestDate: string;
    completedDate?: string;
    requestedBy: string;
    notes: string;
}

export default function WarehouseTransferPage() {
    const locations = useAppStore((state) => state.locations);

    const [transfers, setTransfers] = useState<WarehouseTransfer[]>([
        {
            id: "wt-001",
            transferCode: "WT-2026-01-001",
            fromWarehouse: "Kho Hà Nội",
            toWarehouse: "Kho TP.HCM",
            assetCount: 50,
            status: "COMPLETED",
            requestDate: "2026-01-10",
            completedDate: "2026-01-15",
            requestedBy: "Nguyễn Văn A",
            notes: "Điều chuyển thiết bị văn phòng chi nhánh mới",
        },
        {
            id: "wt-002",
            transferCode: "WT-2026-01-002",
            fromWarehouse: "Kho TP.HCM",
            toWarehouse: "Kho Đà Nẵng",
            assetCount: 30,
            status: "IN_TRANSIT",
            requestDate: "2026-01-18",
            requestedBy: "Trần Thị B",
            notes: "Chuyển máy tính và máy in",
        },
        {
            id: "wt-003",
            transferCode: "WT-2026-01-003",
            fromWarehouse: "Kho Hà Nội",
            toWarehouse: "Kho Cần Thơ",
            assetCount: 20,
            status: "PENDING",
            requestDate: "2026-01-20",
            requestedBy: "Lê Văn C",
            notes: "Điều chuyển bàn ghế",
        },
    ]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState({
        transferCode: "",
        fromWarehouse: "",
        toWarehouse: "",
        assetCount: 0,
        notes: "",
    });

    const handleCreate = () => {
        const newTransfer: WarehouseTransfer = {
            id: `wt-${Date.now()}`,
            ...formData,
            status: "PENDING",
            requestDate: new Date().toISOString().slice(0, 10),
            requestedBy: "Current User",
        };
        setTransfers([...transfers, newTransfer]);
        setIsCreateOpen(false);
        setFormData({ transferCode: "", fromWarehouse: "", toWarehouse: "", assetCount: 0, notes: "" });
    };

    const handleUpdateStatus = (id: string, newStatus: "IN_TRANSIT" | "COMPLETED") => {
        setTransfers(
            transfers.map((t) =>
                t.id === id
                    ? {
                          ...t,
                          status: newStatus,
                          completedDate: newStatus === "COMPLETED" ? new Date().toISOString().slice(0, 10) : undefined,
                      }
                    : t,
            ),
        );
    };

    const handleExport = () => {
        const exportData = transfers.map((transfer) => ({
            "Mã phiếu": transfer.transferCode,
            "Kho xuất": transfer.fromWarehouse,
            "Kho nhận": transfer.toWarehouse,
            "Số lượng TS": transfer.assetCount,
            "Trạng thái": transfer.status === "COMPLETED" ? "Hoàn thành" : transfer.status === "IN_TRANSIT" ? "Đang vận chuyển" : "Chờ xử lý",
            "Ngày yêu cầu": transfer.requestDate,
            "Ngày hoàn thành": transfer.completedDate || "",
            "Người yêu cầu": transfer.requestedBy,
            "Ghi chú": transfer.notes,
        }));
        exportToExcel(exportData, `Dieu_chuyen_kho_${new Date().toISOString().slice(0, 10)}`, "Điều chuyển kho");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Warehouse className="h-6 w-6" />
                        Điều chuyển giữa các kho
                    </h1>
                    <p className="text-muted-foreground">Quản lý điều chuyển tài sản giữa các kho</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo phiếu điều chuyển
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo phiếu điều chuyển kho</DialogTitle>
                                <DialogDescription>Nhập thông tin điều chuyển tài sản giữa các kho</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label>Mã phiếu</Label>
                                    <Input
                                        value={formData.transferCode}
                                        onChange={(e) => setFormData({ ...formData, transferCode: e.target.value })}
                                        placeholder="WT-2026-01-004"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Kho xuất</Label>
                                        <Select value={formData.fromWarehouse} onValueChange={(value) => setFormData({ ...formData, fromWarehouse: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn kho..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations.map((loc) => (
                                                    <SelectItem key={loc.id} value={loc.name}>
                                                        {loc.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Kho nhận</Label>
                                        <Select value={formData.toWarehouse} onValueChange={(value) => setFormData({ ...formData, toWarehouse: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn kho..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations.map((loc) => (
                                                    <SelectItem key={loc.id} value={loc.name}>
                                                        {loc.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Số lượng tài sản</Label>
                                    <Input
                                        type="number"
                                        value={formData.assetCount}
                                        onChange={(e) => setFormData({ ...formData, assetCount: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ghi chú</Label>
                                    <Input
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Mô tả..."
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate} disabled={!formData.transferCode || !formData.fromWarehouse || !formData.toWarehouse}>
                                    Tạo phiếu
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Tổng phiếu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{transfers.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Chờ xử lý</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{transfers.filter((t) => t.status === "PENDING").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Đang vận chuyển</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{transfers.filter((t) => t.status === "IN_TRANSIT").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Hoàn thành</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{transfers.filter((t) => t.status === "COMPLETED").length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách phiếu điều chuyển kho</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã phiếu</TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-2">
                                        <span>Kho</span>
                                        <ArrowRightLeft className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead>Số lượng TS</TableHead>
                                <TableHead>Ngày yêu cầu</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transfers.map((transfer) => (
                                <TableRow key={transfer.id}>
                                    <TableCell className="font-medium">{transfer.transferCode}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <span>{transfer.fromWarehouse}</span>
                                            <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                                            <span>{transfer.toWarehouse}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{transfer.assetCount}</TableCell>
                                    <TableCell>{transfer.requestDate}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={transfer.status === "COMPLETED" ? "default" : transfer.status === "IN_TRANSIT" ? "secondary" : "outline"}
                                        >
                                            {transfer.status === "COMPLETED"
                                                ? "Hoàn thành"
                                                : transfer.status === "IN_TRANSIT"
                                                  ? "Đang vận chuyển"
                                                  : "Chờ xử lý"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {transfer.status === "PENDING" && (
                                                <Button size="sm" onClick={() => handleUpdateStatus(transfer.id, "IN_TRANSIT")}>
                                                    Bắt đầu vận chuyển
                                                </Button>
                                            )}
                                            {transfer.status === "IN_TRANSIT" && (
                                                <Button size="sm" onClick={() => handleUpdateStatus(transfer.id, "COMPLETED")}>
                                                    Hoàn thành
                                                </Button>
                                            )}
                                            {transfer.status === "COMPLETED" && <span className="text-sm text-muted-foreground">{transfer.completedDate}</span>}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
