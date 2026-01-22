"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PackageX, Plus, Download } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

export default function ReturnToWarehousePage() {
    const assets = useAppStore((state) => state.assets);
    const locations = useAppStore((state) => state.locations);
    const [returnRecords, setReturnRecords] = useState<any[]>([
        {
            id: "ret-001",
            assetId: assets[0]?.id,
            fromLocation: "Văn phòng Tầng 2",
            returnDate: "2026-01-20",
            reason: "Kết thúc dự án",
            status: "RETURNED",
        },
    ]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedAssetId, setSelectedAssetId] = useState("");
    const [reason, setReason] = useState("");

    const assetsInUse = assets.filter((a) => a.status === "ACTIVE" && a.location !== "Kho chính");

    const handleCreateReturn = () => {
        if (!selectedAssetId) return;

        const asset = assets.find((a) => a.id === selectedAssetId);
        const newReturn = {
            id: `ret-${Date.now()}`,
            assetId: selectedAssetId,
            fromLocation: asset?.location || "",
            returnDate: new Date().toISOString().slice(0, 10),
            reason,
            status: "RETURNED",
        };

        setReturnRecords([...returnRecords, newReturn]);
        setIsCreateOpen(false);
        setSelectedAssetId("");
        setReason("");
        alert("Đã ghi nhận trả tài sản về kho!");
    };

    const handleExport = () => {
        const exportData = returnRecords.map((record) => {
            const asset = assets.find((a) => a.id === record.assetId);
            return {
                "Mã phiếu": record.id,
                "Mã tài sản": asset?.code || "",
                "Tên tài sản": asset?.name || "",
                "Từ vị trí": record.fromLocation,
                "Ngày trả": record.returnDate,
                "Lý do": record.reason,
                "Trạng thái": "Đã trả về kho",
            };
        });
        exportToExcel(exportData, `Phieu_tra_ve_kho_${new Date().toISOString().slice(0, 10)}`, "Trả về kho");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <PackageX className="h-6 w-6" />
                    Trả tài sản về kho
                </h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo phiếu trả về kho
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo phiếu trả tài sản về kho</DialogTitle>
                                <DialogDescription>Chọn tài sản đang sử dụng để trả về kho.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label>Chọn tài sản</Label>
                                    <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn tài sản..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {assetsInUse.map((a) => (
                                                <SelectItem key={a.id} value={a.id}>
                                                    {a.code} - {a.name} (Hiện tại: {a.location})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Lý do trả về</Label>
                                    <Textarea
                                        placeholder="Ví dụ: Kết thúc dự án, chuyển đổi thiết bị..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateReturn} disabled={!selectedAssetId}>
                                    Xác nhận trả về kho
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách phiếu trả về kho</CardTitle>
                    <CardDescription>Theo dõi tài sản đã được trả về kho trung tâm</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã phiếu</TableHead>
                                <TableHead>Tài sản</TableHead>
                                <TableHead>Từ vị trí</TableHead>
                                <TableHead>Ngày trả</TableHead>
                                <TableHead>Lý do</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {returnRecords.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        Chưa có phiếu trả về kho nào.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                returnRecords.map((record) => {
                                    const asset = assets.find((a) => a.id === record.assetId);
                                    return (
                                        <TableRow key={record.id}>
                                            <TableCell className="font-medium">{record.id}</TableCell>
                                            <TableCell>
                                                {asset?.code} - {asset?.name}
                                            </TableCell>
                                            <TableCell>{record.fromLocation}</TableCell>
                                            <TableCell>{record.returnDate}</TableCell>
                                            <TableCell className="max-w-md truncate">{record.reason}</TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
