"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus, Play, Download, Lock, Calendar, Mail, XCircle } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { exportToExcel } from "@/lib/exportUtils";
import { useAppStore } from "@/lib/store";

export default function AuditPage() {
    const auditSessions = useAppStore((state) => state.auditSessions);
    const createAuditSession = useAppStore((state) => state.createAuditSession);
    const [sessions, setSessions] = useState(auditSessions);
    const [isNewOpen, setIsNewOpen] = useState(false);
    const [newAuditName, setNewAuditName] = useState("");
    const [newAuditLocation, setNewAuditLocation] = useState("Văn phòng Chính");

    const handleCreate = () => {
        if (!newAuditName) return;

        const newSession = {
            id: `au-${Date.now()}`,
            code: `KK-${new Date().toISOString().slice(0, 7)}-${Math.floor(Math.random() * 100)}`,
            name: newAuditName,
            date: new Date().toISOString().slice(0, 10),
            status: "PENDING" as const,
            location: newAuditLocation,
        };

        createAuditSession(newSession);
        setSessions([...sessions, newSession]);
        setIsNewOpen(false);
        setNewAuditName("");
    };

    const handleLock = (id: string) => {
        if (confirm("Chốt số liệu kỳ kiểm kê này?")) {
            setSessions(sessions.map((s) => (s.id === id ? { ...s, status: "LOCKED" as const } : s)));
            alert("Đã chốt số liệu kỳ kiểm kê!");
        }
    };

    const handleExtend = (id: string) => {
        if (confirm("Gia hạn kỳ kiểm kê?")) {
            alert("Đã gia hạn kỳ kiểm kê!");
        }
    };

    const handleSendEmail = (id: string) => {
        if (confirm("Gửi email thông báo cho tất cả người liên quan?")) {
            alert("Đã gửi email thông báo!");
        }
    };

    const handleClose = (id: string) => {
        if (confirm("Đóng kỳ kiểm kê này? Sau khi đóng sẽ không thể chỉnh sửa.")) {
            setSessions(sessions.map((s) => (s.id === id ? { ...s, status: "COMPLETED" as const } : s)));
            alert("Đã đóng kỳ kiểm kê!");
        }
    };

    const handleExport = () => {
        const exportData = sessions.map((session) => ({
            "Mã kỳ": session.code,
            "Tên kỳ kiểm kê": session.name,
            "Ngày tạo": session.date,
            "Vị trí": session.location,
            "Trạng thái": session.status,
        }));
        exportToExcel(exportData, \`Ky_kiem_ke_\${new Date().toISOString().slice(0, 10)}\`, "Kiểm kê");
    };

    const columns: ColumnDef<any>[] = [
        { accessorKey: "code", header: "Mã đợt" },
        { accessorKey: "name", header: "Tên đợt kiểm kê" },
        { accessorKey: "date", header: "Ngày tạo" },
        { accessorKey: "location", header: "Phạm vi" },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => (
                <Badge
                    variant={
                        row.original.status === "COMPLETED"
                            ? "default"
                            : row.original.status === "LOCKED"
                              ? "secondary"
                              : row.original.status === "IN_PROGRESS"
                                ? "outline"
                                : "outline"
                    }
                >
                    {row.original.status === "COMPLETED"
                        ? "Hoàn thành"
                        : row.original.status === "LOCKED"
                          ? "Đã chốt"
                          : row.original.status === "IN_PROGRESS"
                            ? "Đang thực hiện"
                            : "Chờ thực hiện"}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: "Thao tác",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" asChild>
                        <Link href={\`/dashboard/assets/audit/\${row.original.id}\`}>
                            <Play className="mr-1 h-3 w-3" /> Thực hiện
                        </Link>
                    </Button>
                    {row.original.status === "PENDING" && (
                        <>
                            <Button size="sm" variant="ghost" onClick={() => handleSendEmail(row.original.id)} title="Gửi email">
                                <Mail className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleLock(row.original.id)} title="Chốt dữ liệu">
                                <Lock className="h-3 w-3" />
                            </Button>
                        </>
                    )}
                    {row.original.status === "LOCKED" && (
                        <>
                            <Button size="sm" variant="ghost" onClick={() => handleExtend(row.original.id)} title="Gia hạn">
                                <Calendar className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleClose(row.original.id)} title="Đóng kỳ">
                                <XCircle className="h-3 w-3" />
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <ClipboardList className="h-6 w-6" />
                        Kiểm kê tài sản
                    </h1>
                    <p className="text-muted-foreground">Quản lý các kỳ kiểm kê tài sản định kỳ</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                    <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Tạo đợt kiểm kê
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo đợt kiểm kê mới</DialogTitle>
                                <DialogDescription>Nhập thông tin kỳ kiểm kê tài sản</DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div className="space-y-2">
                                    <Label>Tên đợt kiểm kê</Label>
                                    <Input value={newAuditName} onChange={(e) => setNewAuditName(e.target.value)} placeholder="Ví dụ: Kiểm kê tháng 01..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phạm vi / Vị trí</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                                        value={newAuditLocation}
                                        onChange={(e) => setNewAuditLocation(e.target.value)}
                                    >
                                        <option>Văn phòng Chính</option>
                                        <option>Chi nhánh Hà Nội</option>
                                        <option>Chi nhánh TP.HCM</option>
                                        <option>Kho trung tâm</option>
                                    </select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate}>Tạo</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="rounded-md border p-4">
                <DataTable columns={columns} data={sessions} />
            </div>
        </div>
    );
}
