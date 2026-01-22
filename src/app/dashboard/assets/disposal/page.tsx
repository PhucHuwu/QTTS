"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Download, AlertTriangle } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

interface DisposalRecord {
    id: string;
    disposalCode: string;
    assetCode: string;
    assetName: string;
    reason: string;
    method: "BURN" | "BURY" | "RECYCLE" | "OTHER";
    status: "PENDING" | "APPROVED" | "COMPLETED";
    requestDate: string;
    completedDate?: string;
    requestedBy: string;
    approvedBy?: string;
    notes: string;
}

export default function DisposalPage() {
    const assets = useAppStore((state) => state.assets);

    const [disposalRecords, setDisposalRecords] = useState<DisposalRecord[]>([
        {
            id: "dp-001",
            disposalCode: "TH-2026-01-001",
            assetCode: "TS-001",
            assetName: "Máy tính cũ HP",
            reason: "Hỏng không sửa được",
            method: "RECYCLE",
            status: "COMPLETED",
            requestDate: "2026-01-05",
            completedDate: "2026-01-10",
            requestedBy: "Nguyễn Văn A",
            approvedBy: "Manager",
            notes: "Đã phối hợp với công ty thu hồi",
        },
        {
            id: "dp-002",
            disposalCode: "TH-2026-01-002",
            assetCode: "TS-025",
            assetName: "Bàn làm việc gỗ",
            reason: "Hư hỏng nặng",
            method: "BURN",
            status: "APPROVED",
            requestDate: "2026-01-15",
            requestedBy: "Trần Thị B",
            approvedBy: "Manager",
            notes: "Chờ đơn vị môi trường xác nhận",
        },
        {
            id: "dp-003",
            disposalCode: "TH-2026-01-003",
            assetCode: "TS-050",
            assetName: "Ghế văn phòng",
            reason: "Quá thời gian sử dụng",
            method: "OTHER",
            status: "PENDING",
            requestDate: "2026-01-20",
            requestedBy: "Lê Văn C",
            notes: "Liên hệ đơn vị thu mua phế liệu",
        },
    ]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState({
        disposalCode: "",
        assetCode: "",
        assetName: "",
        reason: "",
        method: "RECYCLE" as const,
        notes: "",
    });

    const handleCreate = () => {
        const newDisposal: DisposalRecord = {
            id: `dp-${Date.now()}`,
            ...formData,
            status: "PENDING",
            requestDate: new Date().toISOString().slice(0, 10),
            requestedBy: "Current User",
        };
        setDisposalRecords([...disposalRecords, newDisposal]);
        setIsCreateOpen(false);
        setFormData({ disposalCode: "", assetCode: "", assetName: "", reason: "", method: "RECYCLE", notes: "" });
    };

    const handleApprove = (id: string) => {
        if (confirm("Xác nhận phê duyệt tiêu hủy?")) {
            setDisposalRecords(
                disposalRecords.map((d) =>
                    d.id === id
                        ? {
                              ...d,
                              status: "APPROVED" as const,
                              approvedBy: "Current User",
                          }
                        : d,
                ),
            );
        }
    };

    const handleComplete = (id: string) => {
        if (confirm("Xác nhận hoàn thành tiêu hủy?")) {
            setDisposalRecords(
                disposalRecords.map((d) =>
                    d.id === id
                        ? {
                              ...d,
                              status: "COMPLETED" as const,
                              completedDate: new Date().toISOString().slice(0, 10),
                          }
                        : d,
                ),
            );
        }
    };

    const handleExport = () => {
        const exportData = disposalRecords.map((disposal) => ({
            "Mã phiếu": disposal.disposalCode,
            "Mã TS": disposal.assetCode,
            "Tên TS": disposal.assetName,
            "Lý do": disposal.reason,
            "Phương pháp": disposal.method === "BURN" ? "Đốt" : disposal.method === "BURY" ? "Chôn lấp" : disposal.method === "RECYCLE" ? "Tái chế" : "Khác",
            "Trạng thái": disposal.status === "COMPLETED" ? "Hoàn thành" : disposal.status === "APPROVED" ? "Đã duyệt" : "Chờ duyệt",
            "Ngày yêu cầu": disposal.requestDate,
            "Ngày hoàn thành": disposal.completedDate || "",
            "Người yêu cầu": disposal.requestedBy,
            "Người duyệt": disposal.approvedBy || "",
        }));
        exportToExcel(exportData, `Tieu_huy_tai_san_${new Date().toISOString().slice(0, 10)}`, "Tiêu hủy");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Trash2 className="h-6 w-6" />
                        Tiêu hủy tài sản
                    </h1>
                    <p className="text-muted-foreground">Quản lý quy trình tiêu hủy tài sản hỏng</p>
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
                                Tạo phiếu tiêu hủy
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo phiếu tiêu hủy</DialogTitle>
                                <DialogDescription>
                                    <div className="flex items-center gap-2 text-yellow-600">
                                        <AlertTriangle className="h-4 w-4" />
                                        Tiêu hủy là hành động không thể hoàn tác
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label>Mã phiếu</Label>
                                    <Input
                                        value={formData.disposalCode}
                                        onChange={(e) => setFormData({ ...formData, disposalCode: e.target.value })}
                                        placeholder="TH-2026-01-004"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Mã tài sản</Label>
                                        <Input
                                            value={formData.assetCode}
                                            onChange={(e) => setFormData({ ...formData, assetCode: e.target.value })}
                                            placeholder="TS-XXX"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tên tài sản</Label>
                                        <Input value={formData.assetName} onChange={(e) => setFormData({ ...formData, assetName: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Lý do tiêu hủy</Label>
                                    <Input
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        placeholder="Hỏng không sửa được..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phương pháp tiêu hủy</Label>
                                    <Select value={formData.method} onValueChange={(value: any) => setFormData({ ...formData, method: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="RECYCLE">Tái chế</SelectItem>
                                            <SelectItem value="BURN">Đốt</SelectItem>
                                            <SelectItem value="BURY">Chôn lấp</SelectItem>
                                            <SelectItem value="OTHER">Khác</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Ghi chú</Label>
                                    <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate} disabled={!formData.disposalCode || !formData.assetCode}>
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
                        <div className="text-2xl font-bold">{disposalRecords.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Chờ duyệt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{disposalRecords.filter((d) => d.status === "PENDING").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Đã duyệt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{disposalRecords.filter((d) => d.status === "APPROVED").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Hoàn thành</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{disposalRecords.filter((d) => d.status === "COMPLETED").length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách phiếu tiêu hủy</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã phiếu</TableHead>
                                <TableHead>Tài sản</TableHead>
                                <TableHead>Lý do</TableHead>
                                <TableHead>Phương pháp</TableHead>
                                <TableHead>Ngày yêu cầu</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {disposalRecords.map((disposal) => (
                                <TableRow key={disposal.id}>
                                    <TableCell className="font-medium">{disposal.disposalCode}</TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{disposal.assetCode}</div>
                                            <div className="text-sm text-muted-foreground">{disposal.assetName}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">{disposal.reason}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {disposal.method === "BURN"
                                                ? "Đốt"
                                                : disposal.method === "BURY"
                                                  ? "Chôn"
                                                  : disposal.method === "RECYCLE"
                                                    ? "Tái chế"
                                                    : "Khác"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{disposal.requestDate}</TableCell>
                                    <TableCell>
                                        <Badge variant={disposal.status === "COMPLETED" ? "default" : disposal.status === "APPROVED" ? "secondary" : "outline"}>
                                            {disposal.status === "COMPLETED" ? "Hoàn thành" : disposal.status === "APPROVED" ? "Đã duyệt" : "Chờ duyệt"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {disposal.status === "PENDING" && (
                                                <Button size="sm" onClick={() => handleApprove(disposal.id)}>
                                                    Phê duyệt
                                                </Button>
                                            )}
                                            {disposal.status === "APPROVED" && (
                                                <Button size="sm" onClick={() => handleComplete(disposal.id)}>
                                                    Hoàn thành
                                                </Button>
                                            )}
                                            {disposal.status === "COMPLETED" && <span className="text-sm text-muted-foreground">{disposal.completedDate}</span>}
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
