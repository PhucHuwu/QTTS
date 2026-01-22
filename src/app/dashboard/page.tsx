"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { Package, DollarSign, AlertCircle, ClipboardList, ArrowRightLeft, FileText, Users, Trash2, Edit, Plus, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const assets = useAppStore((state) => state.assets);
    const maintenanceTickets = useAppStore((state) => state.maintenanceTickets);
    const auditSessions = useAppStore((state) => state.auditSessions);
    const transferRecords = useAppStore((state) => state.transferRecords);

    // Statistics
    const activeAssets = assets.filter((a) => a.status === "ACTIVE").length;
    const maintenanceAssets = assets.filter((a) => a.status === "MAINTENANCE").length;
    const brokenAssets = assets.filter((a) => a.status === "BROKEN").length;
    const totalValue = assets.reduce((sum, a) => sum + a.price, 0);
    const pendingMaintenance = maintenanceTickets.filter((t) => t.status === "PENDING").length;
    const pendingAudits = auditSessions.filter((s) => s.status === "PENDING").length;
    const recentTransfers = transferRecords.slice(-5).reverse();

    // Group by status
    const statusGroups = assets.reduce(
        (acc, asset) => {
            acc[asset.status] = (acc[asset.status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>,
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Tổng quan hệ thống quản lý tài sản</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng tài sản</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{assets.length}</div>
                        <p className="text-xs text-muted-foreground">{activeAssets} đang hoạt động</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng giá trị</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("vi-VN", { notation: "compact", style: "currency", currency: "VND" }).format(totalValue)}
                        </div>
                        <p className="text-xs text-muted-foreground">Tổng nguyên giá</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cần bảo trì</CardTitle>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingMaintenance}</div>
                        <p className="text-xs text-muted-foreground">{maintenanceAssets + brokenAssets} TS cần xử lý</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kiểm kê</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingAudits}</div>
                        <p className="text-xs text-muted-foreground">Đợt chưa hoàn thành</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Phân bố trạng thái tài sản</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(statusGroups).map(([status, count]) => {
                                const percentage = (count / assets.length) * 100;
                                const colorClass =
                                    status === "ACTIVE"
                                        ? "bg-green-500"
                                        : status === "MAINTENANCE"
                                          ? "bg-yellow-500"
                                          : status === "BROKEN"
                                            ? "bg-red-500"
                                            : "bg-gray-500";

                                return (
                                    <div key={status} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{status}</span>
                                            <span className="text-muted-foreground">
                                                {count} ({percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div className={`h-full ${colorClass} transition-all`} style={{ width: `${percentage}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Hoạt động gần đây</CardTitle>
                        <CardDescription>5 lần điều chuyển mới nhất</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTransfers.map((transfer) => {
                                const asset = assets.find((a) => a.id === transfer.assetId);
                                return (
                                    <div key={transfer.id} className="flex items-start gap-2">
                                        <ArrowRightLeft className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium">{asset?.name || "Unknown"}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {transfer.fromLocation} → {transfer.toLocation}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{new Date(transfer.date).toLocaleDateString("vi-VN")}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Quản lý nhanh</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/assets/new">
                                <Package className="mr-2 h-4 w-4" />
                                Thêm tài sản mới
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/assets/maintenance">
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Tạo phiếu bảo trì
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/assets/transfer">
                                <ArrowRightLeft className="mr-2 h-4 w-4" />
                                Điều chuyển tài sản
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Báo cáo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/reports">
                                <FileText className="mr-2 h-4 w-4" />
                                Xem tất cả báo cáo
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/assets">
                                <Package className="mr-2 h-4 w-4" />
                                Danh sách tài sản
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/assets/by-manager">
                                <Users className="mr-2 h-4 w-4" />
                                Theo người giữ
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Kiểm kê & Thanh lý</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/assets/audit">
                                <ClipboardList className="mr-2 h-4 w-4" />
                                Kiểm kê tài sản
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/assets/liquidation">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Thanh lý tài sản
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/assets/bulk-update">
                                <Edit className="mr-2 h-4 w-4" />
                                Cập nhật hàng loạt
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
