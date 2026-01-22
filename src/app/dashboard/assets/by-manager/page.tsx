"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users } from "lucide-react";

export default function AssetsByManagerPage() {
    const assets = useAppStore((state) => state.assets);
    const users = useAppStore((state) => state.users);

    // Group assets by manager
    const assetsByManager = assets.reduce(
        (acc, asset) => {
            if (!acc[asset.managerId]) {
                acc[asset.managerId] = [];
            }
            acc[asset.managerId].push(asset);
            return acc;
        },
        {} as Record<string, typeof assets>,
    );

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Theo dõi tài sản theo Người giữ
                </h1>
                <p className="text-muted-foreground">Thống kê tài sản theo người quản lý và đơn vị</p>
            </div>

            <div className="grid gap-4">
                {Object.entries(assetsByManager).map(([managerId, managerAssets]) => {
                    const manager = users.find((u) => u.id === managerId);
                    const totalValue = managerAssets.reduce((sum, a) => sum + a.price, 0);

                    return (
                        <Card key={managerId}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        {manager?.name || managerId}
                                    </div>
                                    <div className="text-sm font-normal text-muted-foreground">
                                        <Badge variant="outline">{manager?.role}</Badge>
                                    </div>
                                </CardTitle>
                                <CardDescription>
                                    {managerAssets.length} tài sản · Tổng giá trị:{" "}
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalValue)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Mã TS</TableHead>
                                            <TableHead>Tên tài sản</TableHead>
                                            <TableHead>Vị trí</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead className="text-right">Giá trị</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {managerAssets.map((asset) => (
                                            <TableRow key={asset.id}>
                                                <TableCell className="font-medium">
                                                    <Link href={`/dashboard/assets/${asset.id}`} className="hover:underline hover:text-primary">
                                                        {asset.code}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{asset.name}</TableCell>
                                                <TableCell>{asset.location}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={asset.status === "ACTIVE" ? "default" : "secondary"}
                                                        className={
                                                            asset.status === "ACTIVE"
                                                                ? "bg-green-500 hover:bg-green-600"
                                                                : asset.status === "MAINTENANCE"
                                                                  ? "bg-yellow-500 hover:bg-yellow-600"
                                                                  : ""
                                                        }
                                                    >
                                                        {asset.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(asset.price)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
