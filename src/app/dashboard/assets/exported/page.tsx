"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDown, Download, Search } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

export default function ExportedAssetsPage() {
    const assets = useAppStore((state) => state.assets);

    // Assets đã xuất toán - LIQUIDATED status
    const exportedAssets = assets.filter((a) => a.status === "LIQUIDATED");

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Filter function
    const filteredAssets = exportedAssets.filter((asset) => {
        const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || asset.code.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const handleExport = () => {
        const exportData = filteredAssets.map((asset) => ({
            "Mã TS": asset.code,
            "Tên tài sản": asset.name,
            "Danh mục": asset.categoryId,
            "Ngày mua": asset.purchaseDate,
            "Giá trị": asset.price,
            "Vị trí": asset.location,
            "Trạng thái": asset.status,
        }));
        exportToExcel(exportData, `Tai_san_xuat_toan_${new Date().toISOString().slice(0, 10)}`, "Xuất toán");
    };

    const totalValue = filteredAssets.reduce((sum, a) => sum + a.price, 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <FileDown className="h-6 w-6" />
                        Tài sản đã xuất toán
                    </h1>
                    <p className="text-muted-foreground">Theo dõi tài sản đã thanh lý / xuất toán</p>
                </div>
                <Button onClick={handleExport} disabled={filteredAssets.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Xuất Excel ({filteredAssets.length})
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Tổng số TS xuất toán</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{filteredAssets.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Tổng giá trị xuất toán</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("vi-VN", { notation: "compact", style: "currency", currency: "VND" }).format(totalValue)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Giá trị trung bình</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("vi-VN", { notation: "compact", style: "currency", currency: "VND" }).format(
                                filteredAssets.length > 0 ? totalValue / filteredAssets.length : 0,
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tìm kiếm và Lọc (UC-A27)</CardTitle>
                    <CardDescription>Tìm kiếm tài sản đã xuất toán</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm theo mã TS hoặc tên..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách tài sản đã xuất toán</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã TS</TableHead>
                                <TableHead>Tên tài sản</TableHead>
                                <TableHead>Danh mục</TableHead>
                                <TableHead>Ngày mua</TableHead>
                                <TableHead>Giá trị</TableHead>
                                <TableHead>Vị trí cuối</TableHead>
                                <TableHead>Trạng thái</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAssets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        {searchTerm ? "Không tìm thấy tài sản phù hợp" : "Chưa có tài sản xuất toán"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAssets.map((asset) => (
                                    <TableRow key={asset.id}>
                                        <TableCell className="font-medium">{asset.code}</TableCell>
                                        <TableCell>{asset.name}</TableCell>
                                        <TableCell>{asset.categoryId}</TableCell>
                                        <TableCell>{asset.purchaseDate}</TableCell>
                                        <TableCell>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(asset.price)}</TableCell>
                                        <TableCell>{asset.location}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{asset.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
