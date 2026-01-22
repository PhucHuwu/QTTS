"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PackagePlus, Plus, Download, Search } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

interface WarehouseIntake {
    id: string;
    intakeCode: string;
    batchCode: string;
    assetCount: number;
    status: "PENDING_PRINT" | "PRINTED" | "COMPLETED";
    createdDate: string;
    notes: string;
}

export default function WarehouseIntakePage() {
    const assets = useAppStore((state) => state.assets);

    const [intakeRecords, setIntakeRecords] = useState<WarehouseIntake[]>([
        {
            id: "intake-001",
            intakeCode: "NK-2026-01-001",
            batchCode: "LOT-2026-01-001",
            assetCount: 15,
            status: "COMPLETED",
            createdDate: "2026-01-16",
            notes: "Nhập thiết bị văn phòng Q1",
        },
        {
            id: "intake-002",
            intakeCode: "NK-2026-01-002",
            batchCode: "LOT-2026-01-002",
            assetCount: 25,
            status: "PENDING_PRINT",
            createdDate: "2026-01-20",
            notes: "Nhập máy tính và phụ kiện",
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState({
        intakeCode: "",
        batchCode: "",
        assetCount: 0,
        notes: "",
    });

    const filteredRecords = intakeRecords.filter(
        (record) => record.intakeCode.toLowerCase().includes(searchTerm.toLowerCase()) || record.batchCode.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleCreate = () => {
        const newIntake: WarehouseIntake = {
            id: `intake-${Date.now()}`,
            ...formData,
            status: "PENDING_PRINT",
            createdDate: new Date().toISOString().slice(0, 10),
        };
        setIntakeRecords([...intakeRecords, newIntake]);
        setIsCreateOpen(false);
        setFormData({ intakeCode: "", batchCode: "", assetCount: 0, notes: "" });
    };

    const handlePrint = (id: string) => {
        setIntakeRecords(intakeRecords.map((r) => (r.id === id ? { ...r, status: "PRINTED" as const } : r)));
        alert("Đã gửi lệnh in tem/nhãn tài sản!");
    };

    const handleComplete = (id: string) => {
        setIntakeRecords(intakeRecords.map((r) => (r.id === id ? { ...r, status: "COMPLETED" as const } : r)));
        alert("Đã hoàn thành nhập kho!");
    };

    const handleExport = () => {
        const exportData = filteredRecords.map((record) => ({
            "Mã phiếu nhập kho": record.intakeCode,
            "Mã lô": record.batchCode,
            "Số lượng TS": record.assetCount,
            "Trạng thái": record.status === "COMPLETED" ? "Hoàn thành" : record.status === "PRINTED" ? "Đã in tem" : "Chờ in tem",
            "Ngày tạo": record.createdDate,
            "Ghi chú": record.notes,
        }));
        exportToExcel(exportData, `Nhap_kho_${new Date().toISOString().slice(0, 10)}`, "Nhập kho");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <PackagePlus className="h-6 w-6" />
                        Nhập kho tài sản
                    </h1>
                    <p className="text-muted-foreground">Quản lý phiếu nhập kho và in/dán tem</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo phiếu nhập kho
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo phiếu nhập kho</DialogTitle>
                                <DialogDescription>Nhập thông tin phiếu nhập kho tài sản</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label>Mã phiếu nhập kho</Label>
                                    <Input
                                        value={formData.intakeCode}
                                        onChange={(e) => setFormData({ ...formData, intakeCode: e.target.value })}
                                        placeholder="NK-2026-01-003"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mã lô tham chiếu</Label>
                                    <Input
                                        value={formData.batchCode}
                                        onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                                        placeholder="LOT-2026-01-003"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Số lượng tài sản</Label>
                                    <Input
                                        type="number"
                                        value={formData.assetCount}
                                        onChange={(e) => setFormData({ ...formData, assetCount: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ghi chú</Label>
                                    <Input
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Mô tả..."
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate} disabled={!formData.intakeCode || !formData.batchCode}>
                                    Tạo phiếu
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Tổng phiếu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{intakeRecords.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Chờ in tem</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{intakeRecords.filter((r) => r.status === "PENDING_PRINT").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Đã in tem</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{intakeRecords.filter((r) => r.status === "PRINTED").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Hoàn thành</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{intakeRecords.filter((r) => r.status === "COMPLETED").length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tìm kiếm</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm theo mã phiếu hoặc mã lô..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách phiếu nhập kho</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã phiếu</TableHead>
                                <TableHead>Mã lô</TableHead>
                                <TableHead>Số lượng TS</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRecords.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">{record.intakeCode}</TableCell>
                                    <TableCell>{record.batchCode}</TableCell>
                                    <TableCell>{record.assetCount}</TableCell>
                                    <TableCell>{record.createdDate}</TableCell>
                                    <TableCell>
                                        <Badge variant={record.status === "COMPLETED" ? "default" : record.status === "PRINTED" ? "secondary" : "outline"}>
                                            {record.status === "COMPLETED" ? "Hoàn thành" : record.status === "PRINTED" ? "Đã in tem" : "Chờ in tem"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {record.status === "PENDING_PRINT" && (
                                                <Button size="sm" onClick={() => handlePrint(record.id)}>
                                                    In tem
                                                </Button>
                                            )}
                                            {record.status === "PRINTED" && (
                                                <Button size="sm" onClick={() => handleComplete(record.id)}>
                                                    Hoàn thành
                                                </Button>
                                            )}
                                            {record.status === "COMPLETED" && <span className="text-sm text-muted-foreground">Đã xong</span>}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
