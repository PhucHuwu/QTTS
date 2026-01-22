"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Plus, Download, FileText, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

interface BatchImport {
    id: string;
    batchCode: string;
    name: string;
    itemCount: number;
    totalValue: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdDate: string;
    createdBy: string;
    approvedBy?: string;
    approvedDate?: string;
    notes?: string;
}

export default function BatchImportPage() {
    const assets = useAppStore((state) => state.assets);

    const [batches, setBatches] = useState<BatchImport[]>([
        {
            id: "batch-001",
            batchCode: "LOT-2026-01-001",
            name: "Nhập thiết bị văn phòng Q1/2026",
            itemCount: 15,
            totalValue: 250000000,
            status: "APPROVED",
            createdDate: "2026-01-15",
            createdBy: "Admin",
            approvedBy: "Manager",
            approvedDate: "2026-01-16",
        },
        {
            id: "batch-002",
            batchCode: "LOT-2026-01-002",
            name: "Nhập máy tính và phụ kiện",
            itemCount: 25,
            totalValue: 500000000,
            status: "PENDING",
            createdDate: "2026-01-20",
            createdBy: "Admin",
        },
    ]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<BatchImport | null>(null);
    const [formData, setFormData] = useState({
        batchCode: "",
        name: "",
        itemCount: 0,
        totalValue: 0,
        notes: "",
    });

    const handleCreate = () => {
        const newBatch: BatchImport = {
            id: `batch-${Date.now()}`,
            ...formData,
            status: "PENDING",
            createdDate: new Date().toISOString().slice(0, 10),
            createdBy: "Current User",
        };
        setBatches([...batches, newBatch]);
        setIsCreateOpen(false);
        setFormData({ batchCode: "", name: "", itemCount: 0, totalValue: 0, notes: "" });
    };

    const handleEdit = () => {
        if (!selectedBatch) return;
        setBatches(batches.map((b) => (b.id === selectedBatch.id ? { ...b, ...formData } : b)));
        setIsEditOpen(false);
        setSelectedBatch(null);
    };

    const handleDelete = (id: string) => {
        if (confirm("Xác nhận xóa phiếu nhập lô này?")) {
            setBatches(batches.filter((b) => b.id !== id));
        }
    };

    const handleApprove = (id: string) => {
        if (confirm("Xác nhận phê duyệt phiếu nhập lô này?")) {
            setBatches(
                batches.map((b) =>
                    b.id === id
                        ? {
                              ...b,
                              status: "APPROVED" as const,
                              approvedBy: "Current User",
                              approvedDate: new Date().toISOString().slice(0, 10),
                          }
                        : b,
                ),
            );
        }
    };

    const handleReject = (id: string) => {
        if (confirm("Xác nhận từ chối phiếu nhập lô này?")) {
            setBatches(batches.map((b) => (b.id === id ? { ...b, status: "REJECTED" as const } : b)));
        }
    };

    const handleExport = () => {
        const exportData = batches.map((batch) => ({
            "Mã lô": batch.batchCode,
            "Tên phiếu nhập": batch.name,
            "Số lượng": batch.itemCount,
            "Tổng giá trị": batch.totalValue,
            "Trạng thái": batch.status === "PENDING" ? "Chờ duyệt" : batch.status === "APPROVED" ? "Đã duyệt" : "Từ chối",
            "Ngày tạo": batch.createdDate,
            "Người tạo": batch.createdBy,
            "Người duyệt": batch.approvedBy || "",
            "Ngày duyệt": batch.approvedDate || "",
        }));
        exportToExcel(exportData, `Phieu_nhap_lo_${new Date().toISOString().slice(0, 10)}`, "Nhập lô");
    };

    const openEdit = (batch: BatchImport) => {
        setSelectedBatch(batch);
        setFormData({
            batchCode: batch.batchCode,
            name: batch.name,
            itemCount: batch.itemCount,
            totalValue: batch.totalValue,
            notes: batch.notes || "",
        });
        setIsEditOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Upload className="h-6 w-6" />
                        Nhập hàng hóa theo lô
                    </h1>
                    <p className="text-muted-foreground">Quản lý phiếu nhập lô và phê duyệt</p>
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
                                Tạo phiếu nhập lô
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo phiếu nhập lô mới</DialogTitle>
                                <DialogDescription>Nhập thông tin phiếu nhập</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label>Mã lô</Label>
                                    <Input
                                        value={formData.batchCode}
                                        onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                                        placeholder="LOT-2026-01-003"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tên phiếu nhập</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Nhập mô tả..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Số lượng</Label>
                                        <Input
                                            type="number"
                                            value={formData.itemCount}
                                            onChange={(e) => setFormData({ ...formData, itemCount: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tổng giá trị (VNĐ)</Label>
                                        <Input
                                            type="number"
                                            value={formData.totalValue}
                                            onChange={(e) => setFormData({ ...formData, totalValue: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Ghi chú</Label>
                                    <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate} disabled={!formData.batchCode || !formData.name}>
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
                        <div className="text-2xl font-bold">{batches.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Chờ duyệt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{batches.filter((b) => b.status === "PENDING").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Đã duyệt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{batches.filter((b) => b.status === "APPROVED").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Tổng giá trị</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">
                            {new Intl.NumberFormat("vi-VN", { notation: "compact", style: "currency", currency: "VND" }).format(
                                batches.reduce((sum, b) => sum + b.totalValue, 0),
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách phiếu nhập lô</CardTitle>
                    <CardDescription>Quản lý và phê duyệt phiếu nhập hàng hóa theo lô</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã lô</TableHead>
                                <TableHead>Tên phiếu</TableHead>
                                <TableHead>Số lượng</TableHead>
                                <TableHead>Tổng giá trị</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {batches.map((batch) => (
                                <TableRow key={batch.id}>
                                    <TableCell className="font-medium">{batch.batchCode}</TableCell>
                                    <TableCell>{batch.name}</TableCell>
                                    <TableCell>{batch.itemCount}</TableCell>
                                    <TableCell>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(batch.totalValue)}</TableCell>
                                    <TableCell>{batch.createdDate}</TableCell>
                                    <TableCell>
                                        <Badge variant={batch.status === "APPROVED" ? "default" : batch.status === "PENDING" ? "secondary" : "destructive"}>
                                            {batch.status === "PENDING" ? "Chờ duyệt" : batch.status === "APPROVED" ? "Đã duyệt" : "Từ chối"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {batch.status === "PENDING" && (
                                                <>
                                                    <Button size="sm" variant="outline" onClick={() => openEdit(batch)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="default" onClick={() => handleApprove(batch.id)}>
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleReject(batch.id)}>
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={() => handleDelete(batch.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                            {batch.status !== "PENDING" && <span className="text-sm text-muted-foreground">{batch.approvedBy || "N/A"}</span>}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa phiếu nhập lô</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Mã lô</Label>
                            <Input value={formData.batchCode} onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Tên phiếu nhập</Label>
                            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Số lượng</Label>
                                <Input
                                    type="number"
                                    value={formData.itemCount}
                                    onChange={(e) => setFormData({ ...formData, itemCount: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tổng giá trị (VNĐ)</Label>
                                <Input
                                    type="number"
                                    value={formData.totalValue}
                                    onChange={(e) => setFormData({ ...formData, totalValue: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Ghi chú</Label>
                            <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleEdit}>Lưu thay đổi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
