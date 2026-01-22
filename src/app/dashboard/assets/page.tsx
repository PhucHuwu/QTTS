"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Download } from "lucide-react";
import Link from "next/link";
import { exportToExcel, formatAssetsForExport } from "@/lib/exportUtils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    const locations = useAppStore((state) => state.locations);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: "",
        location: "",
        minPrice: "",
        maxPrice: "",
    });

    const filteredAssets = assets.filter((asset) => {
        const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || asset.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !filters.status || asset.status === filters.status;
        const matchesLocation = !filters.location || asset.location === filters.location;
        const matchesMinPrice = !filters.minPrice || asset.price >= parseFloat(filters.minPrice);
        const matchesMaxPrice = !filters.maxPrice || asset.price <= parseFloat(filters.maxPrice);
        return matchesSearch && matchesStatus && matchesLocation && matchesMinPrice && matchesMaxPrice;
    });

    const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || id;

    const handleExportExcel = () => {
        const formattedData = formatAssetsForExport(filteredAssets);
        exportToExcel(formattedData, `Danh_sach_tai_san_${new Date().toISOString().slice(0, 10)}`, "Tài sản");
    };

    const handleApplyFilters = () => {
        setIsFilterOpen(false);
    };

    const handleResetFilters = () => {
        setFilters({
            status: "",
            location: "",
            minPrice: "",
            maxPrice: "",
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Danh sách tài sản</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportExcel}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(true)}>
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

            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Bộ lọc nâng cao</DialogTitle>
                        <DialogDescription>Chọn các tiêu chí để lọc danh sách tài sản.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Trạng thái</Label>
                            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tất cả trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Tất cả</SelectItem>
                                    <SelectItem value="ACTIVE">Đang sử dụng</SelectItem>
                                    <SelectItem value="BROKEN">Hỏng</SelectItem>
                                    <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
                                    <SelectItem value="LIQUIDATED">Đã thanh lý</SelectItem>
                                    <SelectItem value="LOST">Mất</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Vị trí</Label>
                            <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tất cả vị trí" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Tất cả</SelectItem>
                                    {locations.map((loc) => (
                                        <SelectItem key={loc.id} value={loc.name}>
                                            {loc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Khoảng giá trị</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    placeholder="Từ (VNĐ)"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                />
                                <span>-</span>
                                <Input
                                    type="number"
                                    placeholder="Đến (VNĐ)"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleResetFilters}>
                            Đặt lại
                        </Button>
                        <Button onClick={handleApplyFilters}>Áp dụng</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
