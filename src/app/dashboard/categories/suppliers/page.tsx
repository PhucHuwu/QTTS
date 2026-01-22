"use client";

import { useAppStore } from "@/lib/store";
import { CategoryManagementPage } from "@/components/category-management-page";
import { Supplier } from "@/types/mock";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatSuppliersForExport } from "@/lib/exportUtils";

export default function SuppliersPage() {
    const data = useAppStore((state) => state.suppliers);
    const add = useAppStore((state) => state.addSupplier);
    const update = useAppStore((state) => state.updateSupplier);
    const remove = useAppStore((state) => state.deleteSupplier);

    const columns: ColumnDef<Supplier>[] = [
        { accessorKey: "code", header: "Mã NCC" },
        { accessorKey: "name", header: "Tên nhà cung cấp" },
        { accessorKey: "contactPerson", header: "Người liên hệ" },
        { accessorKey: "phone", header: "SĐT" },
    ];

    return (
        <CategoryManagementPage<Supplier>
            title="Danh mục Nhà cung cấp"
            data={data}
            onAdd={add}
            onUpdate={update}
            onDelete={remove}
            columns={columns}
            initialFormData={{ name: "", code: "" }}
            exportFormatter={formatSuppliersForExport}
            renderForm={(formData, setFormData) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="code">Mã NCC *</Label>
                        <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Tên NCC *</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="contact">Người liên hệ</Label>
                        <Input id="contact" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">SĐT</Label>
                        <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                </>
            )}
        />
    );
}
