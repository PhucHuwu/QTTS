"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Package, Download, Search, TrendingUp, AlertTriangle } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

interface InventoryStock {
    id: string;
    itemCode: string;
    itemName: string;
    warehouse: string;
    category: string;
    unit: string;
    availableStock: number;
    processingStock: number;
    totalStock: number;
    minStock: number;
    maxStock: number;
    unitPrice: number;
    totalValue: number;
    lastImport: string;
    lastExport: string;
}

interface InventoryTransaction {
    id: string;
    date: string;
    type: "IMPORT" | "EXPORT" | "TRANSFER";
    itemCode: string;
    itemName: string;
    warehouse: string;
    quantity: number;
    unit: string;
    reference: string;
    status: "PENDING" | "COMPLETED";
}

export default function InventoryTrackingPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [warehouseFilter, setWarehouseFilter] = useState("ALL");

    // Mock inventory stock data
    const [inventoryStock] = useState<InventoryStock[]>([
        {
            id: "stock-1",
            itemCode: "VT-001",
            itemName: "Giấy A4",
            warehouse: "Kho văn phòng phẩm",
            category: "Văn phòng phẩm",
            unit: "Ream",
            availableStock: 35,
            processingStock: 10,
            totalStock: 45,
            minStock: 10,
            maxStock: 100,
            unitPrice: 50000,
            totalValue: 2250000,
            lastImport: "2024-01-15",
            lastExport: "2024-01-20",
        },
        {
            id: "stock-2",
            itemCode: "VT-002",
            itemName: "Bút bi",
            warehouse: "Kho văn phòng phẩm",
            category: "Văn phòng phẩm",
            unit: "Hộp",
            availableStock: 8,
            processingStock: 4,
            totalStock: 12,
            minStock: 5,
            maxStock: 50,
            unitPrice: 30000,
            totalValue: 360000,
            lastImport: "2024-01-10",
            lastExport: "2024-01-18",
        },
        {
            id: "stock-3",
            itemCode: "AC-001",
            itemName: "Tem cước phí",
            warehouse: "Kho ấn chỉ",
            category: "Ấn chỉ",
            unit: "Tờ",
            availableStock: 200,
            processingStock: 50,
            totalStock: 250,
            minStock: 100,
            maxStock: 1000,
            unitPrice: 5000,
            totalValue: 1250000,
            lastImport: "2024-01-12",
            lastExport: "2024-01-19",
        },
    ]);

    // Mock transaction history
    const [transactions] = useState<InventoryTransaction[]>([
        {
            id: "trans-1",
            date: "2024-01-20",
            type: "EXPORT",
            itemCode: "VT-001",
            itemName: "Giấy A4",
            warehouse: "Kho văn phòng phẩm",
            quantity: 10,
            unit: "Ream",
            reference: "PXK-001",
            status: "COMPLETED",
        },
        {
            id: "trans-2",
            date: "2024-01-19",
            type: "EXPORT",
            itemCode: "AC-001",
            itemName: "Tem cước phí",
            warehouse: "Kho ấn chỉ",
            quantity: 50,
            unit: "Tờ",
            reference: "PXK-002",
            status: "COMPLETED",
        },
        {
            id: "trans-3",
            date: "2024-01-15",
            type: "IMPORT",
            itemCode: "VT-001",
            itemName: "Giấy A4",
            warehouse: "Kho văn phòng phẩm",
            quantity: 50,
            unit: "Ream",
            reference: "PNK-001",
            status: "COMPLETED",
        },
    ]);

    const filteredStock = inventoryStock.filter((stock) => {
        const matchesSearch =
            stock.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) || stock.itemName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesWarehouse = warehouseFilter === "ALL" || stock.warehouse === warehouseFilter;

        if (activeTab === "all") return matchesSearch && matchesWarehouse;
        if (activeTab === "available") return matchesSearch && matchesWarehouse && stock.availableStock > 0;
        if (activeTab === "processing") return matchesSearch && matchesWarehouse && stock.processingStock > 0;
        return matchesSearch && matchesWarehouse;
    });

    const filteredTransactions = transactions.filter(
        (trans) => trans.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) || trans.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        totalItems: inventoryStock.length,
        totalValue: inventoryStock.reduce((sum, s) => sum + s.totalValue, 0),
        lowStock: inventoryStock.filter((s) => s.totalStock <= s.minStock).length,
        overStock: inventoryStock.filter((s) => s.totalStock >= s.maxStock).length,
    };

    const getStockStatusBadge = (stock: InventoryStock) => {
        if (stock.totalStock <= stock.minStock) {
            return (
                <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Dưới tối thiểu
                </Badge>
            );
        } else if (stock.totalStock >= stock.maxStock) {
            return (
                <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Vượt tối đa
                </Badge>
            );
        } else {
            return <Badge variant="default">Bình thường</Badge>;
        }
    };

    const getTransactionBadge = (type: string) => {
        const variants: Record<string, any> = {
            IMPORT: { variant: "default", label: "Nhập kho" },
            EXPORT: { variant: "destructive", label: "Xuất kho" },
            TRANSFER: { variant: "secondary", label: "Điều chuyển" },
        };

        const config = variants[type] || variants.IMPORT;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const handleExportStock = () => {
        const exportData = filteredStock.map((stock) => ({
            "Mã VT": stock.itemCode,
            "Tên vật tư": stock.itemName,
            Kho: stock.warehouse,
            "Danh mục": stock.category,
            "Đơn vị": stock.unit,
            "Khả dụng": stock.availableStock,
            "Đang xử lý": stock.processingStock,
            "Tổng tồn": stock.totalStock,
            "Tồn min": stock.minStock,
            "Tồn max": stock.maxStock,
            "Đơn giá": stock.unitPrice,
            "Giá trị": stock.totalValue,
            "Nhập cuối": stock.lastImport,
            "Xuất cuối": stock.lastExport,
        }));

        exportToExcel(exportData, "Theo_doi_vat_tu", "Tồn kho");
    };

    const handleExportTransactions = () => {
        const exportData = filteredTransactions.map((trans) => ({
            Ngày: trans.date,
            Loại: trans.type,
            "Mã VT": trans.itemCode,
            "Tên vật tư": trans.itemName,
            Kho: trans.warehouse,
            "Số lượng": trans.quantity,
            "Đơn vị": trans.unit,
            "Chứng từ": trans.reference,
            "Trạng thái": trans.status,
        }));

        exportToExcel(exportData, "Lich_su_nhap_xuat", "Giao dịch");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="h-6 w-6" />
                        Theo dõi Vật tư
                    </h1>
                    <p className="text-sm text-muted-foreground">Theo dõi tồn kho và lịch sử giao dịch vật tư</p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tổng loại VT</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalItems}</div>
                        <p className="text-xs text-muted-foreground">Đang theo dõi</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tổng giá trị</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{(stats.totalValue / 1000000).toFixed(1)}M</div>
                        <p className="text-xs text-muted-foreground">VNĐ</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Dưới tối thiểu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.lowStock}</div>
                        <p className="text-xs text-muted-foreground">Cần nhập thêm</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Vượt tối đa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.overStock}</div>
                        <p className="text-xs text-muted-foreground">Cần xử lý</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <Label>Tìm kiếm</Label>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Mã VT, tên vật tư..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
                            </div>
                        </div>
                        <div>
                            <Label>Kho</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={warehouseFilter}
                                onChange={(e) => setWarehouseFilter(e.target.value)}
                            >
                                <option value="ALL">Tất cả kho</option>
                                <option value="Kho văn phòng phẩm">Kho văn phòng phẩm</option>
                                <option value="Kho ấn chỉ">Kho ấn chỉ</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">Tất cả ({inventoryStock.length})</TabsTrigger>
                    <TabsTrigger value="available">Khả dụng</TabsTrigger>
                    <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
                    <TabsTrigger value="history">Lịch sử</TabsTrigger>
                </TabsList>

                {/* Stock Tabs */}
                {["all", "available", "processing"].includes(activeTab) && (
                    <TabsContent value={activeTab} className="space-y-4">
                        <div className="flex justify-end">
                            <Button onClick={handleExportStock}>
                                <Download className="mr-2 h-4 w-4" />
                                Xuất Excel
                            </Button>
                        </div>

                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Mã VT</TableHead>
                                            <TableHead>Tên vật tư</TableHead>
                                            <TableHead>Kho</TableHead>
                                            <TableHead>Danh mục</TableHead>
                                            <TableHead className="text-right">Khả dụng</TableHead>
                                            <TableHead className="text-right">Đang xử lý</TableHead>
                                            <TableHead className="text-right">Tổng tồn</TableHead>
                                            <TableHead className="text-right">Min-Max</TableHead>
                                            <TableHead className="text-right">Giá trị</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStock.map((stock) => (
                                            <TableRow key={stock.id}>
                                                <TableCell className="font-medium">{stock.itemCode}</TableCell>
                                                <TableCell>{stock.itemName}</TableCell>
                                                <TableCell>
                                                    <div className="text-sm">{stock.warehouse}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{stock.category}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium text-green-600">{stock.availableStock}</TableCell>
                                                <TableCell className="text-right font-medium text-orange-600">{stock.processingStock}</TableCell>
                                                <TableCell className="text-right font-bold">
                                                    {stock.totalStock} {stock.unit}
                                                </TableCell>
                                                <TableCell className="text-right text-xs text-muted-foreground">
                                                    {stock.minStock}-{stock.maxStock}
                                                </TableCell>
                                                <TableCell className="text-right">{stock.totalValue.toLocaleString("vi-VN")}đ</TableCell>
                                                <TableCell>{getStockStatusBadge(stock)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}

                {/* Transaction History Tab */}
                <TabsContent value="history" className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={handleExportTransactions}>
                            <Download className="mr-2 h-4 w-4" />
                            Xuất Excel
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ngày</TableHead>
                                        <TableHead>Loại giao dịch</TableHead>
                                        <TableHead>Mã VT</TableHead>
                                        <TableHead>Tên vật tư</TableHead>
                                        <TableHead>Kho</TableHead>
                                        <TableHead className="text-right">Số lượng</TableHead>
                                        <TableHead>Chứng từ</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTransactions.map((trans) => (
                                        <TableRow key={trans.id}>
                                            <TableCell>{trans.date}</TableCell>
                                            <TableCell>{getTransactionBadge(trans.type)}</TableCell>
                                            <TableCell className="font-medium">{trans.itemCode}</TableCell>
                                            <TableCell>{trans.itemName}</TableCell>
                                            <TableCell>{trans.warehouse}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {trans.quantity} {trans.unit}
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-xs">{trans.reference}</code>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={trans.status === "COMPLETED" ? "default" : "outline"}>
                                                    {trans.status === "COMPLETED" ? "Hoàn thành" : "Chờ xử lý"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
