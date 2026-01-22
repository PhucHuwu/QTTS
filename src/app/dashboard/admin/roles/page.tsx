"use client";

import { useAppStore } from "@/lib/store";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Role } from "@/types/mock";

const PERMISSION_MODULES = [
    { code: "ASSET_READ", name: "Xem Tài sản" },
    { code: "ASSET_WRITE", name: "Thêm/Sửa/Xóa Tài sản" },
    { code: "CATEGORY_READ", name: "Xem Danh mục" },
    { code: "CATEGORY_WRITE", name: "Quản lý Danh mục" },
    { code: "INVENTORY_READ", name: "Xem Kho/Vật tư" },
    { code: "INVENTORY_WRITE", name: "Nhập/Xuất Kho" },
    { code: "REPORT_READ", name: "Xem Báo cáo" },
    { code: "PROFILE_READ", name: "Xem Hồ sơ" },
];

const ROLES: Role[] = ["ADMIN", "MANAGER", "WAREHOUSE_KEEPER", "USER"];

export default function RolesPage() {
    const rolePermissions = useAppStore((state) => state.rolePermissions);
    const updateRolePermissions = useAppStore((state) => state.updateRolePermissions);

    const togglePermission = (role: Role, permCode: string, checked: boolean) => {
        const currentPerms = rolePermissions[role] || [];
        let newPerms;

        if (role === "ADMIN") return; // Admin has all rights

        if (checked) {
            newPerms = [...currentPerms, permCode];
        } else {
            newPerms = currentPerms.filter((p) => p !== permCode);
        }
        updateRolePermissions(role, newPerms);
    };

    const hasPermission = (role: Role, permCode: string) => {
        if (role === "ADMIN") return true;
        return rolePermissions[role]?.includes(permCode) || rolePermissions[role]?.includes("ALL");
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Phân quyền vai trò (Role Matrix)</h1>
            <div className="rounded-md border p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Chức năng / Quyền hạn</TableHead>
                            {ROLES.map((role) => (
                                <TableHead key={role} className="text-center font-bold">
                                    {role}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {PERMISSION_MODULES.map((perm) => (
                            <TableRow key={perm.code}>
                                <TableCell className="font-medium">{perm.name}</TableCell>
                                {ROLES.map((role) => (
                                    <TableCell key={`${role}-${perm.code}`} className="text-center">
                                        <Checkbox
                                            checked={hasPermission(role, perm.code)}
                                            onCheckedChange={(checked) => togglePermission(role, perm.code, checked as boolean)}
                                            disabled={role === "ADMIN"}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <p className="text-sm text-muted-foreground italic">* Vai trò ADMIN mặc định có toàn quyền hệ thống.</p>
        </div>
    );
}
