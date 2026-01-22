"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Warehouse, PackagePlus, PackageMinus, ClipboardCheck, ArrowRightLeft } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
    const cards = [
        {
            title: "Danh mục Vật tư",
            description: "Quản lý danh mục vật tư và kho",
            icon: Package,
            href: "/dashboard/inventory/categories",
            count: "3 loại VT",
            color: "text-blue-600",
        },
        {
            title: "Theo dõi Tồn kho",
            description: "Theo dõi tình trạng vật tư trong kho",
            icon: Warehouse,
            href: "/dashboard/inventory/tracking",
            count: "2 kho",
            color: "text-green-600",
        },
        {
            title: "Nhập kho",
            description: "Quản lý phiếu nhập kho vật tư",
            icon: PackagePlus,
            href: "/dashboard/inventory/import",
            count: "3 phiếu",
            color: "text-purple-600",
        },
        {
            title: "Xuất kho",
            description: "Quản lý phiếu xuất kho vật tư",
            icon: PackageMinus,
            href: "/dashboard/inventory/export",
            count: "3 phiếu",
            color: "text-orange-600",
        },
        {
            title: "Kiểm kê",
            description: "Quản lý kỳ kiểm kê vật tư",
            icon: ClipboardCheck,
            href: "/dashboard/inventory/audit",
            count: "2 kỳ",
            color: "text-red-600",
        },
        {
            title: "Điều chuyển",
            description: "Điều chuyển vật tư giữa các kho",
            icon: ArrowRightLeft,
            href: "/dashboard/inventory/transfer",
            count: "Sắp ra mắt",
            color: "text-gray-600",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Quản lý Vật tư & Ấn chỉ</h1>
                <p className="text-muted-foreground">Module B - Quản lý vật tư tiêu hao</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Card key={card.href} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <Icon className={`h-8 w-8 ${card.color}`} />
                                    <span className="text-sm text-muted-foreground">{card.count}</span>
                                </div>
                                <CardTitle className="text-lg">{card.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                                <Button asChild className="w-full">
                                    <Link href={card.href}>Truy cập</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin Module B</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h4 className="font-medium mb-2">Tính năng đã triển khai:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li>Danh mục vật tư và kho bãi (UC-B01, B02)</li>
                                <li>Theo dõi tồn kho toàn hàng (UC-B03-B08)</li>
                                <li>Nhập kho theo lô với Import (UC-B09-B15)</li>
                                <li>Xuất kho theo lô với Phê duyệt (UC-B18-B24)</li>
                                <li>Kiểm kê vật tư định kỳ (UC-B33-B39)</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Tính năng sắp triển khai:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li>Điều chuyển vật tư giữa các kho (UC-B28-B32)</li>
                                <li>Thanh lý và tiêu hủy vật tư (UC-B48-B59)</li>
                                <li>Quyết toán vật tư (UC-B60-B63)</li>
                                <li>Báo cáo chi tiết (UC-B64)</li>
                                <li>Tích hợp hệ thống Core (UC-B65-B69)</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
