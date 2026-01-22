"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PackagePlus, Plus, Download, Eye, CheckCircle, Upload } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";
import { ImportDialog } from "@/components/import-dialog";
import Link from "next/link";

interface ImportTicket {
    id: string;
    code: string;
    date: string;
    warehouse: string;
    supplier: string;
    totalItems: number;
    totalValue: number;
    status: "DRAFT" | "PENDING" | "APPROVED" | "COMPLETED";
    createdBy: string;
}

export default function InventoryImportPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);

    const [importTickets] = useState<ImportTicket[]>([
        {
            id: "imp-1",
            code: "PNK-VT-2024-001",
            date: "2024-01-15",
            warehouse: "Kho văn phòng phẩm",
            supplier: "Công ty TNHH ABC",
            totalItems: 5,
            totalValue: 15000000,
            status: "COMPLETED",
            createdBy: "Nguyễn Văn A",
        },
        {
            id: "imp-2",
            code: "PNK-VT-2024-002",
            date: "2024-01-18",
            warehouse: "Kho ấn chỉ",
            supplier: "Công ty CP In ấn XYZ",
            totalItems: 3,
            totalValue: 8000000,
            status: "APPROVED",
            createdBy: "Trần Thị B",
        },
        {
            id: "imp-3",
            code: "PNK-VT-2024-003",
            date: "2024-01-20",
            warehouse: "Kho văn phòng phẩm",
            supplier: "Công ty TNHH DEF",
            totalItems: 8,
            totalValue: 12000000,
            status: "PENDING",
            createdBy: "Lê Văn C",
        },
    ]);

    const filteredTickets = importTickets.filter((ticket) => {
        const matchesSearch = ticket.code.toLowerCase().includes(searchTerm.toLowerCase()) || ticket.supplier.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || ticket.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: importTickets.length,
        pending: importTickets.filter((t) => t.status === "PENDING").length,
        approved: importTickets.filter((t) => t.status === "APPROVED").length,
        completed: importTickets.filter((t) => t.status === "COMPLETED").length,
        totalValue: importTickets.reduce((sum, t) => sum + t.totalValue, 0),
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            DRAFT: { variant: "outline", label: "Nháp" },
            PENDING: { variant: "secondary", label: "Chờ duyệt" },
            APPROVED: { variant: "default", label: "Đã duyệt" },
            COMPLETED: { variant: "default", label: "Hoàn thành", className: "bg-green-600" },
        };

        const config = variants[status] || variants.DRAFT;
        return (
            <Badge variant={config.variant} className={config.className}>
                {config.label}
            </Badge>
        );
    };

    const handleExport = () => {
        const exportData = filteredTickets.map((ticket) => ({
            "Mã phiếu": ticket.code,
            Ngày: ticket.date,
            "Kho nhận": ticket.warehouse,
            "Nhà cung cấp": ticket.supplier,
            "Số loại VT": ticket.totalItems,
            "Tổng giá trị": ticket.totalValue,
            "Trạng thái": ticket.status,
            "Người tạo": ticket.createdBy,
        }));

        exportToExcel(exportData, "Danh_sach_nhap_kho_VT", "Nhập kho");
    };

    const handleApprove = (id: string) => {
        if (confirm("Phê duyệt phiếu nhập kho này?")) {
            alert("Đã phê duyệt phiếu nhập kho!");
        }
    };

    const handleImportComplete = (importedData: any[]) => {
        alert(`Đã import thành công ${importedData.length} phiếu nhập kho`);
    };

    return (
        <div className="space-y-6">
            {showImportDialog && (
                <ImportDialog
                    open={showImportDialog}
                    onOpenChange={setShowImportDialog}
                    title="Import danh sách nhập kho vật tư"
                    onImportComplete={handleImportComplete}
                />
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <PackagePlus className="h-6 w-6" />
                        Nhập kho Vật tư
                    </h1>
                    <p className="text-sm text-muted-foreground">Quản lý phiếu nhập kho vật tư</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowImportDialog(true)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                    <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo phiếu nhập
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Tạo phiếu nhập kho mới</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Mã phiếu</Label>
                                        <Input value={`PNK-VT-${new Date().getFullYear()}-${String(importTickets.length + 1).padStart(3, "0")}`} disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Ngày nhập</Label>
                                        <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Kho nhận</Label>
                                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                            <option>Kho văn phòng phẩm</option>
                                            <option>Kho ấn chỉ</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nhà cung cấp</Label>
                                        <Input placeholder="Nhập tên nhà cung cấp" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Ghi chú</Label>
                                    <Input placeholder="Ghi chú thêm..." />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                                    Hủy
                                </Button>
                                <Button
                                    onClick={() => {
                                        alert("Đã tạo phiếu nhập kho!");
                                        setShowNewDialog(false);
                                    }}
                                >
                                    Tạo và thêm vật tư
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tổng phiếu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.approved}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tổng giá trị</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(stats.totalValue / 1000000).toFixed(1)}M</div>
                        <p className="text-xs text-muted-foreground">VNĐ</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <Label>Tìm kiếm</Label>
                            <Input placeholder="Mã phiếu, nhà cung cấp..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div>
                            <Label>Trạng thái</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="ALL">Tất cả</option>
                                <option value="DRAFT">Nháp</option>
                                <option value="PENDING">Chờ duyệt</option>
                                <option value="APPROVED">Đã duyệt</option>
                                <option value="COMPLETED">Hoàn thành</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tickets Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã phiếu</TableHead>
                                <TableHead>Ngày</TableHead>
                                <TableHead>Kho nhận</TableHead>
                                <TableHead>Nhà cung cấp</TableHead>
                                <TableHead className="text-right">Số loại VT</TableHead>
                                <TableHead className="text-right">Tổng giá trị</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Người tạo</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="font-medium">{ticket.code}</TableCell>
                                    <TableCell>{ticket.date}</TableCell>
                                    <TableCell>{ticket.warehouse}</TableCell>
                                    <TableCell>{ticket.supplier}</TableCell>
                                    <TableCell className="text-right">{ticket.totalItems}</TableCell>
                                    <TableCell className="text-right font-medium">{ticket.totalValue.toLocaleString("vi-VN")}đ</TableCell>
                                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                    <TableCell>{ticket.createdBy}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button size="sm" variant="ghost" asChild>
                                                <Link href={`/dashboard/inventory/import/${ticket.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            {ticket.status === "PENDING" && (
                                                <Button size="sm" variant="ghost" onClick={() => handleApprove(ticket.id)}>
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            )}
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
