"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    ACTIVE: { label: "Đang sử dụng", color: "bg-green-500" },
    BROKEN: { label: "Hỏng", color: "bg-red-500" },
    LIQUIDATED: { label: "Đã thanh lý", color: "bg-gray-500" },
    MAINTENANCE: { label: "Bảo trì", color: "bg-yellow-500" },
    LOST: { label: "Mất", color: "bg-orange-500" },
};

export default function AssetListPage() {
    const assets = useAppStore((state) => state.assets);
    const categories = useAppStore((state) => state.categories);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredAssets = assets.filter(
        (asset) => asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || asset.code.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || id;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Danh sách tài sản</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Bộ lọc
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/dashboard/assets/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm mới (Import)
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Tìm kiếm theo tên, mã..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã TS</TableHead>
                            <TableHead>Tên tài sản</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead>Vị trí</TableHead>
                            <TableHead>Giá trị</TableHead>
                            <TableHead>Trạng thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAssets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Không tìm thấy tài sản nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAssets.map((asset) => (
                                <TableRow key={asset.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/dashboard/assets/${asset.id}`} className="hover:underline hover:text-primary">
                                            {asset.code}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{asset.name}</TableCell>
                                    <TableCell>{getCategoryName(asset.categoryId)}</TableCell>
                                    <TableCell>{asset.location}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(asset.price)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={STATUS_MAP[asset.status]?.color + " text-white border-0 hover:" + STATUS_MAP[asset.status]?.color}
                                        >
                                            {STATUS_MAP[asset.status]?.label || asset.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="text-xs text-muted-foreground">
                Hiển thị {filteredAssets.length} trên tổng số {assets.length} tài sản.
            </div>
        </div>
    );
}
