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
    const users = useAppStore((state) => state.users);
    const transferRecords = useAppStore((state) => state.transferRecords);
    const asset = assets.find((a) => a.id === resolvedParams.id);

    if (!asset) {
        notFound();
    }

    const categoryName = categories.find((c) => c.id === asset.categoryId)?.name;
    const assetTransfers = transferRecords.filter((t) => t.assetId === asset.id);

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

            <Tabs defaultValue="info" className="w-full">
                <TabsList>
                    <TabsTrigger value="info">Thông tin chung</TabsTrigger>
                    <TabsTrigger value="history">Lịch sử giao dịch ({assetTransfers.length})</TabsTrigger>
                    <TabsTrigger value="depreciation">Khấu hao</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 mt-4">
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
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lịch sử điều chuyển & giao dịch</CardTitle>
                            <CardDescription>Danh sách các lần điều chuyển tài sản này giữa các vị trí và người quản lý.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {assetTransfers.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8">Chưa có giao dịch nào được ghi nhận.</div>
                            ) : (
                                <div className="space-y-4">
                                    {assetTransfers.map((transfer) => {
                                        const fromUser = users.find((u) => u.id === transfer.fromManager);
                                        const toUser = users.find((u) => u.id === transfer.toManager);
                                        return (
                                            <div key={transfer.id} className="border rounded-lg p-4 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium">Điều chuyển tài sản</div>
                                                    <div className="text-xs text-muted-foreground">{new Date(transfer.date).toLocaleDateString("vi-VN")}</div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground block text-xs">Từ vị trí</span>
                                                        <span>{transfer.fromLocation}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground block text-xs">Đến vị trí</span>
                                                        <span className="font-medium text-primary">{transfer.toLocation}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground block text-xs">Người bàn giao</span>
                                                        <span>{fromUser?.name || transfer.fromManager}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground block text-xs">Người tiếp nhận</span>
                                                        <span className="font-medium">{toUser?.name || transfer.toManager}</span>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-muted-foreground pt-2 border-t">
                                                    <strong>Lý do:</strong> {transfer.reason}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="depreciation" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin khấu hao</CardTitle>
                            <CardDescription>Lịch sử tính toán khấu hao tài sản (Mock calculation)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Nguyên giá:</span>
                                    <span className="font-medium">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(asset.price)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Khấu hao luỹ kế (Mock):</span>
                                    <span className="font-medium">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(asset.price * 0.2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Giá trị còn lại:</span>
                                    <span className="font-medium text-primary">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(asset.price * 0.8)}
                                    </span>
                                </div>
                                <div className="pt-4 text-xs text-muted-foreground">Ghi chú: Đây là số liệu minh họa cho mục đích demo.</div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
