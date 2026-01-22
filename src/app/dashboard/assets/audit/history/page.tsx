"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { History, Eye, Download, FileCheck, Mail } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

interface AuditHistory {
    id: string;
    sessionId: string;
    sessionName: string;
    assetType: "SHARED" | "PRIVATE" | "WAREHOUSE";
    location: string;
    startDate: string;
    endDate: string;
    totalAssets: number;
    checkedAssets: number;
    matchedAssets: number;
    mismatchedAssets: number;
    missingAssets: number;
    excessAssets: number;
    status: "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "APPROVED";
    createdBy: string;
    approvedBy?: string;
    approvedDate?: string;
    reportFile?: string;
}

export default function AuditHistoryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("ALL");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [selectedHistory, setSelectedHistory] = useState<AuditHistory | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);

    // Mock audit history data
    const [auditHistories] = useState<AuditHistory[]>([
        {
            id: "hist-1",
            sessionId: "audit-2024-01",
            sessionName: "Kiểm kê định kỳ Q1/2024",
            assetType: "SHARED",
            location: "Toàn công ty",
            startDate: "2024-01-01",
            endDate: "2024-01-15",
            totalAssets: 250,
            checkedAssets: 250,
            matchedAssets: 235,
            mismatchedAssets: 10,
            missingAssets: 3,
            excessAssets: 2,
            status: "APPROVED",
            createdBy: "Nguyễn Văn A",
            approvedBy: "Trần Thị B",
            approvedDate: "2024-01-16",
            reportFile: "bao-cao-kiem-ke-q1-2024.pdf",
        },
        {
            id: "hist-2",
            sessionId: "audit-2024-02",
            sessionName: "Kiểm kê tài sản riêng - Phòng IT",
            assetType: "PRIVATE",
            location: "Phòng IT - Tầng 3",
            startDate: "2024-02-01",
            endDate: "2024-02-05",
            totalAssets: 45,
            checkedAssets: 45,
            matchedAssets: 43,
            mismatchedAssets: 2,
            missingAssets: 0,
            excessAssets: 0,
            status: "COMPLETED",
            createdBy: "Lê Văn C",
        },
        {
            id: "hist-3",
            sessionId: "audit-2024-03",
            sessionName: "Kiểm kê kho tầng 1",
            assetType: "WAREHOUSE",
            location: "Kho tầng 1",
            startDate: "2024-03-01",
            endDate: "2024-03-10",
            totalAssets: 150,
            checkedAssets: 120,
            matchedAssets: 115,
            mismatchedAssets: 5,
            missingAssets: 0,
            excessAssets: 0,
            status: "IN_PROGRESS",
            createdBy: "Phạm Thị D",
        },
    ]);

    const filteredHistories = auditHistories.filter((hist) => {
        const matchesSearch =
            hist.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) || hist.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === "ALL" || hist.assetType === typeFilter;
        const matchesStatus = statusFilter === "ALL" || hist.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            DRAFT: { variant: "outline", label: "Nháp" },
            IN_PROGRESS: { variant: "secondary", label: "Đang thực hiện" },
            COMPLETED: { variant: "default", label: "Hoàn thành" },
            APPROVED: { variant: "default", label: "Đã phê duyệt", className: "bg-green-600" },
        };

        const config = variants[status] || variants.DRAFT;

        return (
            <Badge variant={config.variant} className={config.className}>
                {config.label}
            </Badge>
        );
    };

    const getTypeBadge = (type: string) => {
        const labels: Record<string, string> = {
            SHARED: "TS dùng chung",
            PRIVATE: "TS dùng riêng",
            WAREHOUSE: "TS kho",
        };

        return <Badge variant="secondary">{labels[type] || type}</Badge>;
    };

    const handleViewDetail = (history: AuditHistory) => {
        setSelectedHistory(history);
        setShowDetailDialog(true);
    };

    const handleExportHistory = () => {
        const exportData = filteredHistories.map((hist) => ({
            "Mã kỳ KK": hist.sessionId,
            "Tên kỳ KK": hist.sessionName,
            "Loại TS": hist.assetType,
            "Vị trí": hist.location,
            "Ngày bắt đầu": hist.startDate,
            "Ngày kết thúc": hist.endDate,
            "Tổng TS": hist.totalAssets,
            "Đã kiểm": hist.checkedAssets,
            Khớp: hist.matchedAssets,
            Lệch: hist.mismatchedAssets,
            Thiếu: hist.missingAssets,
            Thừa: hist.excessAssets,
            "Trạng thái": hist.status,
            "Người tạo": hist.createdBy,
            "Người phê duyệt": hist.approvedBy || "-",
            "Ngày phê duyệt": hist.approvedDate || "-",
        }));

        exportToExcel(exportData, "Lich_su_kiem_ke", "Lịch sử");
    };

    const calculateCompletionRate = (hist: AuditHistory) => {
        if (hist.totalAssets === 0) return 0;
        return Math.round((hist.checkedAssets / hist.totalAssets) * 100);
    };

    const calculateAccuracyRate = (hist: AuditHistory) => {
        if (hist.checkedAssets === 0) return 0;
        return Math.round((hist.matchedAssets / hist.checkedAssets) * 100);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <History className="h-6 w-6" />
                        Lịch sử kiểm kê tài sản
                    </h1>
                    <p className="text-sm text-muted-foreground">Xem lại các kỳ kiểm kê đã thực hiện</p>
                </div>
                <Button onClick={handleExportHistory}>
                    <Download className="mr-2 h-4 w-4" />
                    Xuất báo cáo
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Bộ lọc</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <Label>Tìm kiếm</Label>
                            <Input placeholder="Tên kỳ KK, vị trí..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div>
                            <Label>Loại tài sản</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="ALL">Tất cả</option>
                                <option value="SHARED">TS dùng chung</option>
                                <option value="PRIVATE">TS dùng riêng</option>
                                <option value="WAREHOUSE">TS kho</option>
                            </select>
                        </div>
                        <div>
                            <Label>Trạng thái</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="ALL">Tất cả</option>
                                <option value="DRAFT">Nháp</option>
                                <option value="IN_PROGRESS">Đang thực hiện</option>
                                <option value="COMPLETED">Hoàn thành</option>
                                <option value="APPROVED">Đã phê duyệt</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* History table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã kỳ KK</TableHead>
                                <TableHead>Tên kỳ kiểm kê</TableHead>
                                <TableHead>Loại TS</TableHead>
                                <TableHead>Vị trí</TableHead>
                                <TableHead>Thời gian</TableHead>
                                <TableHead className="text-center">Tiến độ</TableHead>
                                <TableHead className="text-center">Độ chính xác</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Người tạo</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredHistories.map((hist) => (
                                <TableRow key={hist.id}>
                                    <TableCell className="font-medium">{hist.sessionId}</TableCell>
                                    <TableCell>{hist.sessionName}</TableCell>
                                    <TableCell>{getTypeBadge(hist.assetType)}</TableCell>
                                    <TableCell>{hist.location}</TableCell>
                                    <TableCell>
                                        <div className="text-xs">
                                            <div>{hist.startDate}</div>
                                            <div className="text-muted-foreground">đến {hist.endDate}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium">{calculateCompletionRate(hist)}%</div>
                                            <div className="text-xs text-muted-foreground">
                                                {hist.checkedAssets}/{hist.totalAssets}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium">{calculateAccuracyRate(hist)}%</div>
                                            <div className="text-xs text-muted-foreground">{hist.matchedAssets} khớp</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(hist.status)}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">{hist.createdBy}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => handleViewDetail(hist)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Chi tiết
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Chi tiết kỳ kiểm kê: {selectedHistory?.sessionName}</DialogTitle>
                    </DialogHeader>

                    {selectedHistory && (
                        <div className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label className="text-muted-foreground">Mã kỳ KK</Label>
                                    <div className="font-medium">{selectedHistory.sessionId}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Loại tài sản</Label>
                                    <div>{getTypeBadge(selectedHistory.assetType)}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Vị trí</Label>
                                    <div className="font-medium">{selectedHistory.location}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Trạng thái</Label>
                                    <div>{getStatusBadge(selectedHistory.status)}</div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Tổng số TS</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{selectedHistory.totalAssets}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Đã kiểm tra</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-blue-600">{selectedHistory.checkedAssets}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Tiến độ</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-green-600">{calculateCompletionRate(selectedHistory)}%</div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-4 md:grid-cols-4">
                                <Card className="bg-green-50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-green-800">Khớp</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-green-600">{selectedHistory.matchedAssets}</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-orange-50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-orange-800">Lệch</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-orange-600">{selectedHistory.mismatchedAssets}</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-red-50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-red-800">Thiếu</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-red-600">{selectedHistory.missingAssets}</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-blue-50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-blue-800">Thừa</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-blue-600">{selectedHistory.excessAssets}</div>
                                    </CardContent>
                                </Card>
                            </div>

                            {selectedHistory.approvedBy && (
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Thông tin phê duyệt</h4>
                                    <div className="grid gap-2 md:grid-cols-2 text-sm">
                                        <div>
                                            <Label className="text-muted-foreground">Người phê duyệt</Label>
                                            <div className="font-medium">{selectedHistory.approvedBy}</div>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Ngày phê duyệt</Label>
                                            <div className="font-medium">{selectedHistory.approvedDate}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedHistory.reportFile && (
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1">
                                        <FileCheck className="mr-2 h-4 w-4" />
                                        Xem biên bản
                                    </Button>
                                    <Button variant="outline" className="flex-1">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Gửi email
                                    </Button>
                                    <Button variant="outline" className="flex-1">
                                        <Download className="mr-2 h-4 w-4" />
                                        Tải báo cáo
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
