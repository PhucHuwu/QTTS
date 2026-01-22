"use client";

import { useAppStore } from "@/lib/store";
import { CategoryManagementPage } from "@/components/category-management-page";
import { Location } from "@/types/mock";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatLocationsForExport } from "@/lib/exportUtils";

export default function LocationsPage() {
    const data = useAppStore((state) => state.locations);
    const add = useAppStore((state) => state.addLocation);
    const update = useAppStore((state) => state.updateLocation);
    const remove = useAppStore((state) => state.deleteLocation);

    const columns: ColumnDef<Location>[] = [
        { accessorKey: "code", header: "Mã vị trí" },
        { accessorKey: "name", header: "Tên vị trí" },
        { accessorKey: "parentId", header: "Trực thuộc" },
    ];

    return (
        <CategoryManagementPage<Location>
            title="Danh mục Vị trí / Kho"
            data={data}
            onAdd={add}
            onUpdate={update}
            onDelete={remove}
            columns={columns}
            initialFormData={{ name: "", code: "" }}
            exportFormatter={formatLocationsForExport}
            renderForm={(formData, setFormData) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="code">Mã vị trí *</Label>
                        <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Tên vị trí *</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="parentId">Mã cha (ID)</Label>
                        <Input id="parentId" value={formData.parentId} onChange={(e) => setFormData({ ...formData, parentId: e.target.value })} />
                    </div>
                </>
            )}
        />
    );
}
