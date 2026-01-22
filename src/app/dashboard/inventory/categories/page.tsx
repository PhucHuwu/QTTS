"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Plus, Edit, Trash2, Download, Search, Warehouse } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

interface InventoryItem {
    id: string;
    code: string;
    name: string;
    category: string;
    unit: string;
    minStock: number;
    maxStock: number;
    currentStock: number;
    unitPrice: number;
    status: "ACTIVE" | "INACTIVE";
    description: string;
}

interface Warehouse {
    id: string;
    code: string;
    name: string;
    location: string;
    manager: string;
    capacity: number;
    currentOccupancy: number;
    status: "ACTIVE" | "INACTIVE";
}

export default function InventoryCategoriesPage() {
    const [activeTab, setActiveTab] = useState("items");
    const [searchTerm, setSearchTerm] = useState("");
    const [showItemDialog, setShowItemDialog] = useState(false);
    const [showWarehouseDialog, setShowWarehouseDialog] = useState(false);

    // Mock inventory items data
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
        {
            id: "inv-1",
            code: "VT-001",
            name: "Giấy A4",
            category: "Văn phòng phẩm",
            unit: "Ream",
            minStock: 10,
            maxStock: 100,
            currentStock: 45,
            unitPrice: 50000,
            status: "ACTIVE",
            description: "Giấy A4 80gsm",
        },
        {
            id: "inv-2",
            code: "VT-002",
            name: "Bút bi",
            category: "Văn phòng phẩm",
            unit: "Hộp",
            minStock: 5,
            maxStock: 50,
            currentStock: 12,
            unitPrice: 30000,
            status: "ACTIVE",
            description: "Bút bi xanh, đen",
        },
        {
            id: "inv-3",
            code: "AC-001",
            name: "Tem cước phí",
            category: "Ấn chỉ",
            unit: "Tờ",
            minStock: 100,
            maxStock: 1000,
            currentStock: 250,
            unitPrice: 5000,
            status: "ACTIVE",
            description: "Tem cước phí 5000đ",
        },
    ]);

    // Mock warehouses data
    const [warehouses, setWarehouses] = useState<Warehouse[]>([
        {
            id: "wh-1",
            code: "KHO-VPP",
            name: "Kho văn phòng phẩm",
            location: "Tầng 1 - Tòa nhà A",
            manager: "Nguyễn Văn A",
            capacity: 1000,
            currentOccupancy: 450,
            status: "ACTIVE",
        },
        {
            id: "wh-2",
            code: "KHO-AC",
            name: "Kho ấn chỉ",
            location: "Tầng 2 - Tòa nhà B",
            manager: "Trần Thị B",
            capacity: 500,
            currentOccupancy: 180,
            status: "ACTIVE",
        },
    ]);

    const filteredItems = inventoryItems.filter(
        (item) => item.code.toLowerCase().includes(searchTerm.toLowerCase()) || item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredWarehouses = warehouses.filter(
        (wh) => wh.code.toLowerCase().includes(searchTerm.toLowerCase()) || wh.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExportItems = () => {
        const exportData = filteredItems.map((item) => ({
            "Mã VT": item.code,
            "Tên vật tư": item.name,
            "Danh mục": item.category,
            "Đơn vị": item.unit,
            "Tồn kho": item.currentStock,
            "Tồn tối thiểu": item.minStock,
            "Tồn tối đa": item.maxStock,
            "Đơn giá": item.unitPrice,
            "Trạng thái": item.status,
        }));

        exportToExcel(exportData, "Danh_muc_vat_tu", "Vật tư");
    };

    const handleExportWarehouses = () => {
        const exportData = filteredWarehouses.map((wh) => ({
            "Mã kho": wh.code,
            "Tên kho": wh.name,
            "Vị trí": wh.location,
            "Người quản lý": wh.manager,
            "Sức chứa": wh.capacity,
            "Đang chứa": wh.currentOccupancy,
            "Tỷ lệ": `${Math.round((wh.currentOccupancy / wh.capacity) * 100)}%`,
            "Trạng thái": wh.status,
        }));

        exportToExcel(exportData, "Danh_sach_kho", "Kho");
    };

    const getStockBadge = (item: InventoryItem) => {
        if (item.currentStock <= item.minStock) {
            return <Badge variant="destructive">Dưới tối thiểu</Badge>;
        } else if (item.currentStock >= item.maxStock) {
            return <Badge variant="secondary">Vượt tối đa</Badge>;
        } else {
            return <Badge variant="default">Bình thường</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="h-6 w-6" />
                        Quản lý Vật tư & Ấn chỉ
                    </h1>
                    <p className="text-sm text-muted-foreground">Danh mục vật tư và kho bãi</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="items">Danh mục vật tư ({inventoryItems.length})</TabsTrigger>
                    <TabsTrigger value="warehouses">Danh sách kho ({warehouses.length})</TabsTrigger>
                </TabsList>

                {/* Inventory Items Tab */}
                <TabsContent value="items" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Danh mục vật tư</CardTitle>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Tìm kiếm..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-8 w-64"
                                        />
                                    </div>
                                    <Button variant="outline" onClick={handleExportItems}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Xuất Excel
                                    </Button>
                                    <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Thêm vật tư
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>Thêm vật tư mới</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Mã vật tư</Label>
                                                        <Input placeholder="VT-XXX" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Tên vật tư</Label>
                                                        <Input placeholder="Nhập tên vật tư" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Danh mục</Label>
                                                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                            <option>Văn phòng phẩm</option>
                                                            <option>Ấn chỉ</option>
                                                            <option>Tài liệu</option>
                                                            <option>Khác</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Đơn vị tính</Label>
                                                        <Input placeholder="Cái, Hộp, Tờ..." />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Tồn tối thiểu</Label>
                                                        <Input type="number" placeholder="0" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Tồn tối đa</Label>
                                                        <Input type="number" placeholder="0" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Đơn giá</Label>
                                                        <Input type="number" placeholder="0" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Mô tả</Label>
                                                    <Textarea placeholder="Mô tả chi tiết..." />
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" onClick={() => setShowItemDialog(false)}>
                                                    Hủy
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        alert("Đã thêm vật tư mới!");
                                                        setShowItemDialog(false);
                                                    }}
                                                >
                                                    Lưu
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã VT</TableHead>
                                        <TableHead>Tên vật tư</TableHead>
                                        <TableHead>Danh mục</TableHead>
                                        <TableHead>Đơn vị</TableHead>
                                        <TableHead className="text-right">Tồn kho</TableHead>
                                        <TableHead className="text-right">Min-Max</TableHead>
                                        <TableHead className="text-right">Đơn giá</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.code}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{item.category}</Badge>
                                            </TableCell>
                                            <TableCell>{item.unit}</TableCell>
                                            <TableCell className="text-right font-medium">{item.currentStock}</TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground">
                                                {item.minStock} - {item.maxStock}
                                            </TableCell>
                                            <TableCell className="text-right">{item.unitPrice.toLocaleString("vi-VN")}đ</TableCell>
                                            <TableCell>{getStockBadge(item)}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Button size="sm" variant="ghost">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Warehouses Tab */}
                <TabsContent value="warehouses" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Danh sách kho</CardTitle>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Tìm kiếm..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-8 w-64"
                                        />
                                    </div>
                                    <Button variant="outline" onClick={handleExportWarehouses}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Xuất Excel
                                    </Button>
                                    <Dialog open={showWarehouseDialog} onOpenChange={setShowWarehouseDialog}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Thêm kho
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Thêm kho mới</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Mã kho</Label>
                                                        <Input placeholder="KHO-XXX" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Tên kho</Label>
                                                        <Input placeholder="Nhập tên kho" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Vị trí</Label>
                                                    <Input placeholder="Tầng X - Tòa nhà Y" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Người quản lý</Label>
                                                        <Input placeholder="Tên người quản lý" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Sức chứa</Label>
                                                        <Input type="number" placeholder="0" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" onClick={() => setShowWarehouseDialog(false)}>
                                                    Hủy
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        alert("Đã thêm kho mới!");
                                                        setShowWarehouseDialog(false);
                                                    }}
                                                >
                                                    Lưu
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã kho</TableHead>
                                        <TableHead>Tên kho</TableHead>
                                        <TableHead>Vị trí</TableHead>
                                        <TableHead>Người quản lý</TableHead>
                                        <TableHead className="text-right">Sức chứa</TableHead>
                                        <TableHead className="text-right">Đang chứa</TableHead>
                                        <TableHead className="text-right">Tỷ lệ</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredWarehouses.map((wh) => {
                                        const occupancyRate = Math.round((wh.currentOccupancy / wh.capacity) * 100);
                                        return (
                                            <TableRow key={wh.id}>
                                                <TableCell className="font-medium">{wh.code}</TableCell>
                                                <TableCell className="flex items-center gap-2">
                                                    <Warehouse className="h-4 w-4 text-muted-foreground" />
                                                    {wh.name}
                                                </TableCell>
                                                <TableCell>{wh.location}</TableCell>
                                                <TableCell>{wh.manager}</TableCell>
                                                <TableCell className="text-right">{wh.capacity}</TableCell>
                                                <TableCell className="text-right font-medium">{wh.currentOccupancy}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={occupancyRate > 80 ? "destructive" : occupancyRate > 60 ? "secondary" : "default"}>
                                                        {occupancyRate}%
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={wh.status === "ACTIVE" ? "default" : "outline"}>
                                                        {wh.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1">
                                                        <Button size="sm" variant="ghost">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
