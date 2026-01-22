"use client";

import { useAppStore } from "@/lib/store";
import { CategoryManagementPage } from "@/components/category-management-page";
import { AssetCategory } from "@/types/mock";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCategoriesForExport } from "@/lib/exportUtils";

export default function AssetTypesPage() {
    const data = useAppStore((state) => state.categories);
    const add = useAppStore((state) => state.addCategory);
    const update = useAppStore((state) => state.updateCategory);
    const remove = useAppStore((state) => state.deleteCategory);

    const columns: ColumnDef<AssetCategory>[] = [
        { accessorKey: "code", header: "Mã loại" },
        { accessorKey: "name", header: "Tên loại tài sản" },
        { accessorKey: "parentId", header: "Nhóm cha" },
        { accessorKey: "description", header: "Mô tả" },
    ];

    return (
        <CategoryManagementPage<AssetCategory>
            title="Danh mục Loại tài sản"
            data={data}
            onAdd={add}
            onUpdate={update}
            onDelete={remove}
            columns={columns}
            initialFormData={{ name: "", code: "" }}
            exportFormatter={formatCategoriesForExport}
            renderForm={(formData, setFormData) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="code">Mã loại *</Label>
                        <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Tên loại *</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="parentId">Mã nhóm cha</Label>
                        <Input id="parentId" value={formData.parentId} onChange={(e) => setFormData({ ...formData, parentId: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="desc">Mô tả</Label>
                        <Input id="desc" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                </>
            )}
        />
    );
}
