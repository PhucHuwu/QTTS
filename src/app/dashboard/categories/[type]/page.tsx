"use client";

import { use, useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { MasterData } from "@/types/mock";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PageProps {
    params: Promise<{ type: string }>;
}

const TYPE_MAP: Record<string, { label: string; type: MasterData["type"] }> = {
    "usage-quotas": { label: "Định mức sử dụng", type: "USAGE_QUOTA" },
    "asset-states": { label: "Trạng thái tài sản", type: "ASSET_STATE" },
    units: { label: "Đơn vị tính", type: "UNIT" },
    positions: { label: "Chức danh", type: "POSITION" },
};

export default function GenericCategoryPage({ params }: PageProps) {
    // Unwrapping params using React.use()
    const { type: rawType } = use(params);
    const config = TYPE_MAP[rawType] || { label: "Danh mục", type: "UNIT" };

    const masterData = useAppStore((state) => state.masterData);
    const addMasterData = useAppStore((state) => state.addMasterData);
    const updateMasterData = useAppStore((state) => state.updateMasterData);
    const deleteMasterData = useAppStore((state) => state.deleteMasterData);

    const data = masterData.filter((d) => d.type === config.type);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ code: "", name: "", description: "" });

    const handleSubmit = () => {
        if (!formData.code || !formData.name) return;

        if (editingId) {
            updateMasterData(editingId, formData);
        } else {
            addMasterData({
                id: `md-${Date.now()}`,
                type: config.type,
                active: true,
                ...formData,
            });
        }
        setIsDialogOpen(false);
        setFormData({ code: "", name: "", description: "" });
        setEditingId(null);
    };

    const handleEdit = (item: MasterData) => {
        setEditingId(item.id);
        setFormData({ code: item.code, name: item.name, description: item.description || "" });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Xác nhận xóa bản ghi này?")) {
            deleteMasterData(id);
        }
    };

    const columns: ColumnDef<MasterData>[] = [
        { accessorKey: "code", header: "Mã" },
        { accessorKey: "name", header: "Tên" },
        { accessorKey: "description", header: "Mô tả" },
        {
            accessorKey: "active",
            header: "Kích hoạt",
            cell: ({ row }) => <Checkbox checked={row.original.active} disabled />,
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(row.original)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(row.original.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Danh mục: {config.label}</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => {
                                setEditingId(null);
                                setFormData({ code: "", name: "", description: "" });
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Thêm mới
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? "Cập nhật" : "Thêm mới"} {config.label}
                            </DialogTitle>
                            <DialogDescription>Nhập thông tin chi tiết cho danh mục.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label>Mã</Label>
                                <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Tên</Label>
                                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Mô tả</Label>
                                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSubmit} disabled={!formData.code || !formData.name}>
                                Lưu lại
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border p-4 bg-muted/20">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    );
}
