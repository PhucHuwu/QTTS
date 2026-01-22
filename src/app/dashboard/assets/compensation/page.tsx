"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Plus, Download } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

export default function CompensationPage() {
    const assets = useAppStore((state) => state.assets);
    const users = useAppStore((state) => state.users);
    const [compensationRecords, setCompensationRecords] = useState<any[]>([
        {
            id: "comp-001",
            assetId: assets[0]?.id,
            responsiblePersonId: users[1]?.id,
            reason: "Làm hỏng thiết bị",
            compensationAmount: 5000000,
            date: "2026-01-10",
            status: "PAID",
        },
    ]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedAssetId, setSelectedAssetId] = useState("");
    const [responsiblePersonId, setResponsiblePersonId] = useState("");
    const [reason, setReason] = useState("");
    const [amount, setAmount] = useState("");

    const damagedAssets = assets.filter((a) => a.status === "BROKEN" || a.status === "LOST");

    const handleCreateCompensation = () => {
        if (!selectedAssetId || !responsiblePersonId || !amount) return;

        const newCompensation = {
            id: `comp-${Date.now()}`,
            assetId: selectedAssetId,
            responsiblePersonId,
            reason,
            compensationAmount: parseFloat(amount),
            date: new Date().toISOString().slice(0, 10),
            status: "PENDING",
        };

        setCompensationRecords([...compensationRecords, newCompensation]);
        setIsCreateOpen(false);
        setSelectedAssetId("");
        setResponsiblePersonId("");
        setReason("");
        setAmount("");
        alert("Đã tạo phiếu bồi hoàn thành công!");
    };

    const handleMarkPaid = (id: string) => {
        setCompensationRecords(compensationRecords.map((record) => (record.id === id ? { ...record, status: "PAID" } : record)));
    };

    const handleExport = () => {
        const exportData = compensationRecords.map((record) => {
            const asset = assets.find((a) => a.id === record.assetId);
            const person = users.find((u) => u.id === record.responsiblePersonId);
            return {
                "Mã phiếu": record.id,
                "Mã tài sản": asset?.code || "",
                "Tên tài sản": asset?.name || "",
                "Người chịu trách nhiệm": person?.name || "",
                "Lý do": record.reason,
                "Số tiền bồi hoàn": record.compensationAmount,
                Ngày: record.date,
                "Trạng thái": record.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán",
            };
        });
        exportToExcel(exportData, `Phieu_boi_hoan_${new Date().toISOString().slice(0, 10)}`, "Bồi hoàn");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <DollarSign className="h-6 w-6" />
                    Bồi hoàn tài sản
                </h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo phiếu bồi hoàn
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo phiếu bồi hoàn tài sản</DialogTitle>
                                <DialogDescription>Ghi nhận thiệt hại và xác định người chịu trách nhiệm bồi hoàn.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label>Chọn tài sản bị hỏng/mất</Label>
                                    <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn tài sản..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {damagedAssets.map((a) => (
                                                <SelectItem key={a.id} value={a.id}>
                                                    {a.code} - {a.name} ({a.status})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Người chịu trách nhiệm</Label>
                                    <Select value={responsiblePersonId} onValueChange={setResponsiblePersonId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn người..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((u) => (
                                                <SelectItem key={u.id} value={u.id}>
                                                    {u.name} - {u.role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Số tiền bồi hoàn (VNĐ)</Label>
                                    <Input type="number" placeholder="Nhập số tiền..." value={amount} onChange={(e) => setAmount(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Lý do bồi hoàn</Label>
                                    <Textarea
                                        placeholder="Ví dụ: Làm hỏng thiết bị do sử dụng không đúng cách..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateCompensation} disabled={!selectedAssetId || !responsiblePersonId || !amount}>
                                    Tạo phiếu
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách phiếu bồi hoàn</CardTitle>
                    <CardDescription>Theo dõi các phiếu bồi hoàn tài sản bị hỏng hoặc mất</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã phiếu</TableHead>
                                <TableHead>Tài sản</TableHead>
                                <TableHead>Người chịu trách nhiệm</TableHead>
                                <TableHead>Số tiền</TableHead>
                                <TableHead>Ngày</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {compensationRecords.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        Chưa có phiếu bồi hoàn nào.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                compensationRecords.map((record) => {
                                    const asset = assets.find((a) => a.id === record.assetId);
                                    const person = users.find((u) => u.id === record.responsiblePersonId);
                                    return (
                                        <TableRow key={record.id}>
                                            <TableCell className="font-medium">{record.id}</TableCell>
                                            <TableCell>
                                                {asset?.code} - {asset?.name}
                                            </TableCell>
                                            <TableCell>{person?.name}</TableCell>
                                            <TableCell className="font-semibold text-orange-600">
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(record.compensationAmount)}
                                            </TableCell>
                                            <TableCell>{record.date}</TableCell>
                                            <TableCell>
                                                <Badge variant={record.status === "PAID" ? "default" : "secondary"}>
                                                    {record.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {record.status === "PENDING" && (
                                                    <Button size="sm" onClick={() => handleMarkPaid(record.id)}>
                                                        Xác nhận đã thanh toán
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
