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
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, Plus, Download } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

interface UpgradeRecord {
    id: string;
    upgradeCode: string;
    assetCode: string;
    assetName: string;
    originalValue: number;
    upgradeValue: number;
    totalValue: number;
    upgradeType: "HARDWARE" | "SOFTWARE" | "CAPACITY" | "OTHER";
    status: "PENDING" | "APPROVED" | "COMPLETED";
    requestDate: string;
    completedDate?: string;
    requestedBy: string;
    details: string;
}

export default function AssetUpgradePage() {
    const assets = useAppStore((state) => state.assets);

    const [upgradeRecords, setUpgradeRecords] = useState<UpgradeRecord[]>([
        {
            id: "upg-001",
            upgradeCode: "UPG-2026-01-001",
            assetCode: "TS-010",
            assetName: "Máy tính Dell OptiPlex",
            originalValue: 15000000,
            upgradeValue: 5000000,
            totalValue: 20000000,
            upgradeType: "HARDWARE",
            status: "COMPLETED",
            requestDate: "2026-01-10",
            completedDate: "2026-01-15",
            requestedBy: "Nguyễn Văn A",
            details: "Nâng cấp RAM từ 8GB lên 16GB và thêm SSD 512GB",
        },
        {
            id: "upg-002",
            upgradeCode: "UPG-2026-01-002",
            assetCode: "TS-025",
            assetName: "Server HP ProLiant",
            originalValue: 50000000,
            upgradeValue: 15000000,
            totalValue: 65000000,
            upgradeType: "CAPACITY",
            status: "APPROVED",
            requestDate: "2026-01-18",
            requestedBy: "Trần Thị B",
            details: "Mở rộng dung lượng lưu trữ thêm 2TB",
        },
        {
            id: "upg-003",
            upgradeCode: "UPG-2026-01-003",
            assetCode: "TS-050",
            assetName: "Hệ thống ERP",
            originalValue: 100000000,
            upgradeValue: 20000000,
            totalValue: 120000000,
            upgradeType: "SOFTWARE",
            status: "PENDING",
            requestDate: "2026-01-20",
            requestedBy: "Lê Văn C",
            details: "Nâng cấp lên phiên bản Enterprise với module mới",
        },
    ]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState({
        upgradeCode: "",
        assetCode: "",
        assetName: "",
        originalValue: 0,
        upgradeValue: 0,
        upgradeType: "HARDWARE" as const,
        details: "",
    });

    const handleCreate = () => {
        const newUpgrade: UpgradeRecord = {
            id: `upg-${Date.now()}`,
            ...formData,
            totalValue: formData.originalValue + formData.upgradeValue,
            status: "PENDING",
            requestDate: new Date().toISOString().slice(0, 10),
            requestedBy: "Current User",
        };
        setUpgradeRecords([...upgradeRecords, newUpgrade]);
        setIsCreateOpen(false);
        setFormData({ upgradeCode: "", assetCode: "", assetName: "", originalValue: 0, upgradeValue: 0, upgradeType: "HARDWARE", details: "" });
    };

    const handleApprove = (id: string) => {
        if (confirm("Xác nhận phê duyệt nâng cấp?")) {
            setUpgradeRecords(upgradeRecords.map((u) => (u.id === id ? { ...u, status: "APPROVED" as const } : u)));
        }
    };

    const handleComplete = (id: string) => {
        if (confirm("Xác nhận hoàn thành nâng cấp?")) {
            setUpgradeRecords(
                upgradeRecords.map((u) =>
                    u.id === id
                        ? {
                              ...u,
                              status: "COMPLETED" as const,
                              completedDate: new Date().toISOString().slice(0, 10),
                          }
                        : u,
                ),
            );
        }
    };

    const handleExport = () => {
        const exportData = upgradeRecords.map((upgrade) => ({
            "Mã phiếu": upgrade.upgradeCode,
            "Mã TS": upgrade.assetCode,
            "Tên TS": upgrade.assetName,
            "Giá trị gốc": upgrade.originalValue,
            "Giá trị nâng cấp": upgrade.upgradeValue,
            "Tổng giá trị": upgrade.totalValue,
            "Loại nâng cấp":
                upgrade.upgradeType === "HARDWARE"
                    ? "Phần cứng"
                    : upgrade.upgradeType === "SOFTWARE"
                      ? "Phần mềm"
                      : upgrade.upgradeType === "CAPACITY"
                        ? "Mở rộng"
                        : "Khác",
            "Trạng thái": upgrade.status === "COMPLETED" ? "Hoàn thành" : upgrade.status === "APPROVED" ? "Đã duyệt" : "Chờ duyệt",
            "Ngày yêu cầu": upgrade.requestDate,
            "Ngày hoàn thành": upgrade.completedDate || "",
            "Người yêu cầu": upgrade.requestedBy,
        }));
        exportToExcel(exportData, `Nang_cap_tai_san_${new Date().toISOString().slice(0, 10)}`, "Nâng cấp");
    };

    const totalUpgradeValue = upgradeRecords.reduce((sum, u) => sum + u.upgradeValue, 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <TrendingUp className="h-6 w-6" />
                        Nâng cấp tài sản cố định
                    </h1>
                    <p className="text-muted-foreground">Quản lý nâng cấp và cải tiến tài sản</p>
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
                                Tạo phiếu nâng cấp
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Tạo phiếu nâng cấp tài sản</DialogTitle>
                                <DialogDescription>Nhập thông tin nâng cấp tài sản cố định</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label>Mã phiếu</Label>
                                    <Input
                                        value={formData.upgradeCode}
                                        onChange={(e) => setFormData({ ...formData, upgradeCode: e.target.value })}
                                        placeholder="UPG-2026-01-004"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Mã tài sản</Label>
                                        <Input
                                            value={formData.assetCode}
                                            onChange={(e) => setFormData({ ...formData, assetCode: e.target.value })}
                                            placeholder="TS-XXX"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tên tài sản</Label>
                                        <Input value={formData.assetName} onChange={(e) => setFormData({ ...formData, assetName: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Giá trị gốc (VNĐ)</Label>
                                        <Input
                                            type="number"
                                            value={formData.originalValue}
                                            onChange={(e) => setFormData({ ...formData, originalValue: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Giá trị nâng cấp (VNĐ)</Label>
                                        <Input
                                            type="number"
                                            value={formData.upgradeValue}
                                            onChange={(e) => setFormData({ ...formData, upgradeValue: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tổng giá trị sau nâng cấp</Label>
                                    <div className="text-2xl font-bold text-green-600">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                            formData.originalValue + formData.upgradeValue,
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Loại nâng cấp</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                                        value={formData.upgradeType}
                                        onChange={(e) => setFormData({ ...formData, upgradeType: e.target.value as any })}
                                    >
                                        <option value="HARDWARE">Nâng cấp phần cứng</option>
                                        <option value="SOFTWARE">Nâng cấp phần mềm</option>
                                        <option value="CAPACITY">Mở rộng dung lượng</option>
                                        <option value="OTHER">Khác</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Chi tiết nâng cấp</Label>
                                    <Textarea
                                        value={formData.details}
                                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                        placeholder="Mô tả chi tiết..."
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate} disabled={!formData.upgradeCode || !formData.assetCode}>
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
                        <div className="text-2xl font-bold">{upgradeRecords.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Chờ duyệt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{upgradeRecords.filter((u) => u.status === "PENDING").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Hoàn thành</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{upgradeRecords.filter((u) => u.status === "COMPLETED").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Tổng giá trị nâng cấp</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">
                            {new Intl.NumberFormat("vi-VN", { notation: "compact", style: "currency", currency: "VND" }).format(totalUpgradeValue)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách phiếu nâng cấp</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã phiếu</TableHead>
                                <TableHead>Tài sản</TableHead>
                                <TableHead>Giá trị gốc</TableHead>
                                <TableHead>Giá trị nâng cấp</TableHead>
                                <TableHead>Tổng giá trị</TableHead>
                                <TableHead>Loại</TableHead>
                                <TableHead>Ngày yêu cầu</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {upgradeRecords.map((upgrade) => (
                                <TableRow key={upgrade.id}>
                                    <TableCell className="font-medium">{upgrade.upgradeCode}</TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{upgrade.assetCode}</div>
                                            <div className="text-sm text-muted-foreground">{upgrade.assetName}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat("vi-VN", { notation: "compact", style: "currency", currency: "VND" }).format(
                                            upgrade.originalValue,
                                        )}
                                    </TableCell>
                                    <TableCell className="text-green-600 font-medium">
                                        +
                                        {new Intl.NumberFormat("vi-VN", { notation: "compact", style: "currency", currency: "VND" }).format(
                                            upgrade.upgradeValue,
                                        )}
                                    </TableCell>
                                    <TableCell className="font-bold">
                                        {new Intl.NumberFormat("vi-VN", { notation: "compact", style: "currency", currency: "VND" }).format(upgrade.totalValue)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {upgrade.upgradeType === "HARDWARE"
                                                ? "Phần cứng"
                                                : upgrade.upgradeType === "SOFTWARE"
                                                  ? "Phần mềm"
                                                  : upgrade.upgradeType === "CAPACITY"
                                                    ? "Mở rộng"
                                                    : "Khác"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{upgrade.requestDate}</TableCell>
                                    <TableCell>
                                        <Badge variant={upgrade.status === "COMPLETED" ? "default" : upgrade.status === "APPROVED" ? "secondary" : "outline"}>
                                            {upgrade.status === "COMPLETED" ? "Hoàn thành" : upgrade.status === "APPROVED" ? "Đã duyệt" : "Chờ duyệt"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {upgrade.status === "PENDING" && (
                                                <Button size="sm" onClick={() => handleApprove(upgrade.id)}>
                                                    Phê duyệt
                                                </Button>
                                            )}
                                            {upgrade.status === "APPROVED" && (
                                                <Button size="sm" onClick={() => handleComplete(upgrade.id)}>
                                                    Hoàn thành
                                                </Button>
                                            )}
                                            {upgrade.status === "COMPLETED" && <span className="text-sm text-muted-foreground">{upgrade.completedDate}</span>}
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
