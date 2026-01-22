"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus, Play } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { AuditLog } from "@/types/mock"; // We might need a specific AuditSession type but AuditLog is close enough for demo or we create new mock
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Mock Audit Sessions
const MOCK_AUDITS = [
    { id: "au1", code: "KK-2025-01", name: "Kiểm kê Q1/2025 - Kho A", date: "2025-03-31", status: "PENDING", location: "Kho A" },
    { id: "au2", code: "KK-2024-12", name: "Kiểm kê cuối năm 2024", date: "2024-12-31", status: "COMPLETED", location: "Toàn bộ" },
];

export default function AuditPage() {
    const [audits, setAudits] = useState(MOCK_AUDITS);
    const [isNewOpen, setIsNewOpen] = useState(false);
    const [newAuditName, setNewAuditName] = useState("");

    const handleCreate = () => {
        setAudits([
            {
                id: `au${Date.now()}`,
                code: `KK-${new Date().toISOString().slice(0, 7)}`,
                name: newAuditName,
                date: new Date().toISOString().slice(0, 10),
                status: "PENDING",
                location: "Văn phòng Chính",
            },
            ...audits,
        ]);
        setIsNewOpen(false);
        setNewAuditName("");
    };

    const columns: ColumnDef<any>[] = [
        { accessorKey: "code", header: "Mã đợt" },
        { accessorKey: "name", header: "Tên đợt kiểm kê" },
        { accessorKey: "date", header: "Ngày chốt" },
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

            <div className="rounded-md border p-4">
                <DataTable columns={columns} data={audits} />
            </div>
        </div>
    );
}
