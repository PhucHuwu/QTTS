"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Package, Plus, Download } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

export default function WarehouseExportPage() {
    const assets = useAppStore((state) => state.assets);
    const users = useAppStore((state) => state.users);
    const [exportRecords, setExportRecords] = useState<any[]>([
        {
            id: "exp-001",
            assetId: assets[0]?.id,
            recipientId: users[1]?.id,
            destinationLocation: "Văn phòng Tầng 3",
            exportDate: "2026-01-18",
            purpose: "Trang bị cho phòng mới",
            status: "EXPORTED",
        },
    ]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedAssetId, setSelectedAssetId] = useState("");
    const [recipientId, setRecipientId] = useState("");
    const [destination, setDestination] = useState("");
    const [purpose, setPurpose] = useState("");

    const warehouseAssets = assets.filter((a) => a.status === "ACTIVE" && a.location === "Kho chính");

    const handleCreateExport = () => {
        if (!selectedAssetId || !recipientId || !destination) return;

        const newExport = {
            id: `exp-${Date.now()}`,
            assetId: selectedAssetId,
            recipientId,
            destinationLocation: destination,
            exportDate: new Date().toISOString().slice(0, 10),
            purpose,
            status: "EXPORTED",
        };

        setExportRecords([...exportRecords, newExport]);
        setIsCreateOpen(false);
        setSelectedAssetId("");
        setRecipientId("");
        setDestination("");
        setPurpose("");
        alert("Đã tạo phiếu xuất kho thành công!");
    };

    const handleExport = () => {
        const exportData = exportRecords.map((record) => {
            const asset = assets.find((a) => a.id === record.assetId);
            const recipient = users.find((u) => u.id === record.recipientId);
            return {
                "Mã phiếu": record.id,
                "Mã tài sản": asset?.code || "",
                "Tên tài sản": asset?.name || "",
                "Người nhận": recipient?.name || "",
                "Vị trí đến": record.destinationLocation,
                "Ngày xuất": record.exportDate,
                "Mục đích": record.purpose,
            };
        });
        exportToExcel(exportData, `Phieu_xuat_kho_${new Date().toISOString().slice(0, 10)}`, "Xuất kho");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    Xuất kho tài sản
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
                                Tạo phiếu xuất kho
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo phiếu xuất kho</DialogTitle>
                                <DialogDescription>Chọn tài sản trong kho để xuất ra sử dụng.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label>Chọn tài sản (từ kho)</Label>
                                    <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn tài sản..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {warehouseAssets.map((a) => (
                                                <SelectItem key={a.id} value={a.id}>
                                                    {a.code} - {a.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Người nhận</Label>
                                    <Select value={recipientId} onValueChange={setRecipientId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn người nhận..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((u) => (
                                                <SelectItem key={u.id} value={u.id}>
                                                    {u.name} - {u.role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Vị trí đích</Label>
                                    <Input placeholder="VD: Văn phòng Tầng 3" value={destination} onChange={(e) => setDestination(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mục đích sử dụng</Label>
                                    <Textarea placeholder="Ví dụ: Trang bị cho phòng mới..." value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateExport} disabled={!selectedAssetId || !recipientId || !destination}>
                                    Tạo phiếu xuất
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách phiếu xuất kho</CardTitle>
                    <CardDescription>Theo dõi tài sản đã được xuất ra khỏi kho</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã phiếu</TableHead>
                                <TableHead>Tài sản</TableHead>
                                <TableHead>Người nhận</TableHead>
                                <TableHead>Vị trí đích</TableHead>
                                <TableHead>Ngày xuất</TableHead>
                                <TableHead>Mục đích</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {exportRecords.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        Chưa có phiếu xuất kho nào.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                exportRecords.map((record) => {
                                    const asset = assets.find((a) => a.id === record.assetId);
                                    const recipient = users.find((u) => u.id === record.recipientId);
                                    return (
                                        <TableRow key={record.id}>
                                            <TableCell className="font-medium">{record.id}</TableCell>
                                            <TableCell>
                                                {asset?.code} - {asset?.name}
                                            </TableCell>
                                            <TableCell>{recipient?.name}</TableCell>
                                            <TableCell>{record.destinationLocation}</TableCell>
                                            <TableCell>{record.exportDate}</TableCell>
                                            <TableCell className="max-w-md truncate">{record.purpose}</TableCell>
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
