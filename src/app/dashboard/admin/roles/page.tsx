"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const MODULES = [
    { id: "sys", name: "Quản trị hệ thống" },
    { id: "cat", name: "Quản lý danh mục" },
    { id: "asset", name: "Quản lý tài sản" },
    { id: "report", name: "Báo cáo" },
];

const ROLES = [
    { id: "ADMIN", name: "Quản trị hệ thống" },
    { id: "MANAGER", name: "Quản lý tài sản" },
    { id: "WAREHOUSE_KEEPER", name: "Thủ kho" },
    { id: "USER", name: "Nhân viên" },
];

const PERMISSIONS = ["Xem", "Thêm", "Sửa", "Xóa", "Duyệt"];

export default function RolesPage() {
    // Mock permission state (Role -> Module -> Permission[])
    // For demo, we just toggle checkboxes visually
    const [selectedRole, setSelectedRole] = useState("ADMIN");

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Phân quyền chức năng</h1>
                <Button>Lưu cấu hình</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Vai trò</CardTitle>
                        <CardDescription>Chọn vai trò để phân quyền</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="flex flex-col">
                            {ROLES.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role.id)}
                                    className={`text-left px-4 py-3 text-sm hover:bg-muted font-medium border-l-2 transition-colors ${selectedRole === role.id ? "bg-muted border-primary" : "border-transparent"}`}
                                >
                                    {role.name}
                                    <div className="text-xs text-muted-foreground font-normal">{role.id}</div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle>Ma trận phân quyền: {ROLES.find((r) => r.id === selectedRole)?.name}</CardTitle>
                        <CardDescription>Cấp quyền truy cập cho vai trò đã chọn.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Chức năng</TableHead>
                                    {PERMISSIONS.map((p) => (
                                        <TableHead key={p} className="text-center">
                                            {p}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MODULES.map((module) => (
                                    <TableRow key={module.id}>
                                        <TableCell className="font-medium">{module.name}</TableCell>
                                        {PERMISSIONS.map((p) => (
                                            <TableCell key={p} className="text-center">
                                                <Checkbox
                                                    // Mock logic: Admin has all, others random/partial
                                                    defaultChecked={
                                                        selectedRole === "ADMIN" || (selectedRole === "MANAGER" && p !== "Xóa") || Math.random() > 0.7
                                                    }
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
