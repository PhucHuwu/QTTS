"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Download } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { exportToExcel } from "@/lib/exportUtils";

interface CategoryPageProps<T> {
    title: string;
    data: T[];
    onAdd: (item: T) => void;
    onUpdate: (id: string, updates: Partial<T>) => void;
    onDelete: (id: string) => void;
    columns: ColumnDef<T>[];
    renderForm: (formData: Partial<T>, setFormData: (data: Partial<T>) => void) => React.ReactNode;
    initialFormData: Partial<T>;
    exportFormatter?: (data: T[]) => any[];
}

export function CategoryManagementPage<T extends { id: string; name: string }>({
    title,
    data,
    onAdd,
    onUpdate,
    onDelete,
    columns,
    renderForm,
    initialFormData,
    exportFormatter,
}: CategoryPageProps<T>) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<T>>(initialFormData);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = data.filter(
        (item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase())),
    );

    const handleSave = () => {
        if (editingId) {
            onUpdate(editingId, formData);
        } else {
            onAdd({ ...formData, id: `new_${Date.now()}` } as T);
        }
        setIsDialogOpen(false);
        resetForm();
    };

    const handleEdit = (item: T) => {
        setFormData(item);
        setEditingId(item.id);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa?")) {
            onDelete(id);
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingId(null);
    };

    const handleExportExcel = () => {
        const dataToExport = exportFormatter ? exportFormatter(filteredData) : filteredData;
        exportToExcel(dataToExport, `${title}_${new Date().toISOString().slice(0, 10)}`, title);
    };

    const actionColumn: ColumnDef<T> = {
        id: "actions",
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExportExcel}>
                        <Download className="mr-2 h-4 w-4" /> Xuất Excel
                    </Button>
                    <Button
                        onClick={() => {
                            resetForm();
                            setIsDialogOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Thêm mới
                    </Button>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tìm kiếm..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <DataTable columns={[...columns, actionColumn]} data={filteredData} />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingId ? "Cập nhật" : "Thêm mới"} {title}
                        </DialogTitle>
                        <DialogDescription>Nhập thông tin chi tiết bên dưới.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">{renderForm(formData, setFormData)}</div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSave}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
