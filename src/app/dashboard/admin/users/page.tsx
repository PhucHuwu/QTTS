"use client";

import { useAppStore } from "@/lib/store";
import { CategoryManagementPage } from "@/components/category-management-page";
import { User, Role } from "@/types/mock";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UsersManagementPage() {
    const data = useAppStore((state) => state.users);
    // We need to add CRUD actions for users in store.ts first, but for now let's assume they exist
    // or add a TODO to fix store.ts.
    // Since we are mocking, let's pretend state.users is mutable for demo via generic actions if we had them.
    // Actually, we need to add addUser, updateUser, deleteUser to store.ts.

    const add = useAppStore((state) => state.addUser);
    const update = useAppStore((state) => state.updateUser);
    const remove = useAppStore((state) => state.deleteUser);

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "avatar",
            header: "Avatar",
            cell: ({ row }) => (
                <Avatar className="h-8 w-8">
                    <AvatarImage src={row.original.avatar} />
                    <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
                </Avatar>
            ),
        },
        { accessorKey: "name", header: "Tên hiển thị" },
        { accessorKey: "email", header: "Email / Tài khoản" },
        {
            accessorKey: "role",
            header: "Vai trò",
            cell: ({ row }) => {
                const role = row.original.role;
                const map: Record<string, string> = {
                    ADMIN: "Quản trị hệ thống",
                    MANAGER: "Quản lý",
                    WAREHOUSE_KEEPER: "Thủ kho",
                    USER: "Nhân viên",
                };
                return map[role] || role;
            },
        },
    ];

    return (
        <CategoryManagementPage<User & { code?: string }> // Mock code to satisfy generic constraint temporarily
            title="Quản lý Người dùng"
            data={data.map((u) => ({ ...u, code: u.id }))} // Adapt to generic interface
            onAdd={(item) => add(item)}
            onUpdate={update}
            onDelete={remove}
            columns={columns}
            initialFormData={{ name: "", email: "", role: "USER" }}
            renderForm={(formData, setFormData) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Tên hiển thị *</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Vai trò</Label>
                        <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as Role })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ADMIN">Quản trị hệ thống</SelectItem>
                                <SelectItem value="MANAGER">Quản lý tài sản</SelectItem>
                                <SelectItem value="WAREHOUSE_KEEPER">Thủ kho</SelectItem>
                                <SelectItem value="USER">Nhân viên/Đơn vị</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}
        />
    );
}
