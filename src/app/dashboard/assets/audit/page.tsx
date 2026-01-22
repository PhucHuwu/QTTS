"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus, Play, Download } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { AuditLog } from "@/types/mock"; // We might need a specific AuditSession type but AuditLog is close enough for demo or we create new mock
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { exportToExcel } from "@/lib/exportUtils";

import { useAppStore } from "@/lib/store";

export default function AuditPage() {
    const auditSessions = useAppStore((state) => state.auditSessions);
    const createAuditSession = useAppStore((state) => state.createAuditSession);
    const [isNewOpen, setIsNewOpen] = useState(false);
    const [newAuditName, setNewAuditName] = useState("");
    const [newAuditLocation, setNewAuditLocation] = useState("Văn phòng Chính"); // Should be selectable

    const handleCreate = () => {
        if (!newAuditName) return;

        createAuditSession({
            id: `au-${Date.now()}`,
            code: `KK-${new Date().toISOString().slice(0, 7)}-${Math.floor(Math.random() * 100)}`,
            name: newAuditName,
            date: new Date().toISOString().slice(0, 10),
            status: "PENDING",
            location: newAuditLocation,
        });

        setIsNewOpen(false);
        setNewAuditName("");
    };

    const handleExport = () => {
        const exportData = auditSessions.map((session) => ({
            "Mã kỳ": session.code,
            "Tên kỳ kiểm kê": session.name,
            "Ngày tạo": session.date,
            "Vị trí": session.location,
            "Trạng thái": session.status,
        }));
        exportToExcel(exportData, `Ky_kiem_ke_${new Date().toISOString().slice(0, 10)}`, "Kiểm kê");
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
                <Badge variant={row.original.status === "COMPLETED" ? "default" : "secondary"}>
                    {row.original.status === "COMPLETED" ? "Hoàn thành" : "Đang tiến hành"}
                </Badge>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <Button size="sm" variant="ghost" asChild>
                    <Link href={`/dashboard/assets/audit/${row.original.id}`}>
                        <Play className="mr-2 h-4 w-4" /> Thực hiện
                    </Link>
                </Button>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Kiểm kê tài sản</h1>
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
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div className="space-y-2">
                                    <Label>Tên đợt kiểm kê</Label>
                                    <Input value={newAuditName} onChange={(e) => setNewAuditName(e.target.value)} placeholder="Ví dụ: Kiểm kê tháng 01..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phạm vi / Vị trí</Label>
                                    <Input value="Văn phòng Chính" disabled />
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
                <DataTable columns={columns} data={auditSessions} />
            </div>
        </div>
    );
}
