"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { Package, AlertTriangle, Users } from "lucide-react";

export default function Page() {
    const assets = useAppStore((state) => state.assets);
    const users = useAppStore((state) => state.users);

    const totalAssets = assets.length;
    const totalUsers = users.length;
    const maintenanceAssets = assets.filter((a) => a.status === "MAINTENANCE").length;
    const totalValue = assets.reduce((sum, a) => sum + a.price, 0);

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng tài sản</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalAssets}</div>
                    <p className="text-xs text-muted-foreground">
                        Tổng giá trị: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalValue)}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đang bảo trì/Sửa chữa</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{maintenanceAssets}</div>
                    <p className="text-xs text-muted-foreground">Cần xử lý gấp</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Người dùng hệ thống</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalUsers}</div>
                    <p className="text-xs text-muted-foreground">Đang hoạt động</p>
                </CardContent>
            </Card>

            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:col-span-3 lg:col-span-3 p-4">
                <h3 className="font-semibold mb-4">Hoạt động gần đây</h3>
                <p className="text-sm text-muted-foreground">Chưa có dữ liệu hoạt động.</p>
            </div>
        </div>
    );
}
