"use client";

import { useAppStore } from "@/lib/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function UsersPage() {
    const users = useAppStore((state) => state.users);

    const getRoleName = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "Quản trị hệ thống";
            case "MANAGER":
                return "Quản lý";
            case "WAREHOUSE_KEEPER":
                return "Thủ kho";
            case "USER":
                return "Nhân viên";
            default:
                return role;
        }
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">Danh sách người dùng</h1>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Avatar</TableHead>
                            <TableHead>Tên</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Vai trò</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{getRoleName(user.role)}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
