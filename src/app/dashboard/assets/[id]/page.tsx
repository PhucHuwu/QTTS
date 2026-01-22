"use client";

import { use } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Printer, Edit, History } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use()
    const resolvedParams = use(params);
    const assets = useAppStore((state) => state.assets);
    const categories = useAppStore((state) => state.categories);
    const asset = assets.find((a) => a.id === resolvedParams.id);

    if (!asset) {
        notFound();
    }

    const categoryName = categories.find((c) => c.id === asset.categoryId)?.name;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/assets">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{asset.name}</h1>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            {asset.code}
                            <Badge variant="outline">{categoryName}</Badge>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        In tem
                    </Button>
                    <Button>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin chi tiết</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground block">Trạng thái</span>
                                    <span className="font-medium">{asset.status}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Vị trí</span>
                                    <span className="font-medium">{asset.location}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Giá trị</span>
                                    <span className="font-medium">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(asset.price)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Ngày mua</span>
                                    <span className="font-medium">{asset.purchaseDate}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Thông số kỹ thuật</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">{JSON.stringify(asset.specifications, null, 2)}</pre>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-4 w-4" />
                                Lịch sử biến động
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-l-2 border-muted pl-4 space-y-4">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary" />
                                    <div className="text-sm font-medium">Ghi tăng mới</div>
                                    <div className="text-xs text-muted-foreground">{asset.purchaseDate}</div>
                                    <div className="text-xs text-muted-foreground">Admin đã thêm tài sản này.</div>
                                </div>
                                {/* Mock history */}
                                {asset.status === "MAINTENANCE" && (
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-yellow-500" />
                                        <div className="text-sm font-medium">Báo hỏng / Bảo trì</div>
                                        <div className="text-xs text-muted-foreground">2025-01-20</div>
                                        <div className="text-xs text-muted-foreground">Yêu cầu sửa chữa màn hình.</div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
