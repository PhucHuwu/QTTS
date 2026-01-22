"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Plus, Download, Lock, Mail, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { exportToExcel } from "@/lib/exportUtils";

interface InventoryAuditSession {
    id: string;
    code: string;
    name: string;
    warehouse: string;
    date: string;
    status: "PENDING" | "LOCKED" | "IN_PROGRESS" | "COMPLETED";
    totalItems: number;
    checkedItems: number;
}

export default function InventoryAuditPage() {
    const [sessions, setSessions] = useState<InventoryAuditSession[]>([
        {
            id: "ia-1",
            code: "KK-VT-2024-01",
            name: "Kiểm kê định kỳ Q1/2024",
            warehouse: "Kho văn phòng phẩm",
            date: "2024-01-10",
            status: "COMPLETED",
            totalItems: 25,
            checkedItems: 25,
        },
        {
            id: "ia-2",
            code: "KK-VT-2024-02",
            name: "Kiểm kê ấn chỉ đột xuất",
            warehouse: "Kho ấn chỉ",
            date: "2024-01-15",
            status: "LOCKED",
            totalItems: 15,
            checkedItems: 15,
        },
    ]);

    const [showNewDialog, setShowNewDialog] = useState(false);

    const handleCreate = () => {
        alert("Đã tạo kỳ kiểm kê vật tư!");
        setShowNewDialog(false);
    };

    const handleExport = () => {
        const exportData = sessions.map((s) => ({
            "Mã kỳ KK": s.code,
            "Tên kỳ": s.name,
            Kho: s.warehouse,
            Ngày: s.date,
            "Trạng thái": s.status,
            "Tổng số VT": s.totalItems,
            "Đã kiểm": s.checkedItems,
        }));
        exportToExcel(exportData, "Kiem_ke_vat_tu", "Kiểm kê");
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            PENDING: { variant: "outline", label: "Chờ thực hiện" },
            LOCKED: { variant: "secondary", label: "Đã chốt" },
            IN_PROGRESS: { variant: "outline", label: "Đang thực hiện" },
            COMPLETED: { variant: "default", label: "Hoàn thành" },
        };

        const config = variants[status] || variants.PENDING;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ClipboardCheck className="h-6 w-6" />
                        Kiểm kê Vật tư
                    </h1>
                    <p className="text-sm text-muted-foreground">Quản lý kỳ kiểm kê vật tư</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                    <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo kỳ kiểm kê
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo kỳ kiểm kê mới</DialogTitle>
                                <DialogDescription>Nhập thông tin kỳ kiểm kê vật tư</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Tên kỳ kiểm kê</Label>
                                    <Input placeholder="Ví dụ: Kiểm kê định kỳ..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Kho</Label>
                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option>Kho văn phòng phẩm</option>
                                        <option>Kho ấn chỉ</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Ngày bắt đầu</Label>
                                    <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                                    Hủy
                                </Button>
                                <Button onClick={handleCreate}>Tạo</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã kỳ KK</TableHead>
                                <TableHead>Tên kỳ kiểm kê</TableHead>
                                <TableHead>Kho</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead>Tiến độ</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessions.map((session) => (
                                <TableRow key={session.id}>
                                    <TableCell className="font-medium">{session.code}</TableCell>
                                    <TableCell>{session.name}</TableCell>
                                    <TableCell>{session.warehouse}</TableCell>
                                    <TableCell>{session.date}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {session.checkedItems}/{session.totalItems}
                                            <div className="text-xs text-muted-foreground">
                                                {Math.round((session.checkedItems / session.totalItems) * 100)}%
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(session.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button size="sm" variant="ghost" title="Gửi email">
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                            {session.status === "PENDING" && (
                                                <Button size="sm" variant="ghost" title="Chốt dữ liệu">
                                                    <Lock className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {session.status === "LOCKED" && (
                                                <Button size="sm" variant="ghost" title="Đóng kỳ">
                                                    <XCircle className="h-4 w-4" />
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
