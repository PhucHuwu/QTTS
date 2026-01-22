"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ClipboardCheck } from "lucide-react";

interface ApprovalRequest {
    id: string;
    type: "LOAN" | "MAINTENANCE" | "RETURN" | "WAREHOUSE_TRANSFER" | "COMPENSATION" | "DISPOSAL";
    requestCode: string;
    assetInfo: string;
    requestedBy: string;
    requestDate: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    status: "PENDING" | "APPROVED" | "REJECTED";
    details: string;
}

export default function ApprovalsPage() {
    const [approvals, setApprovals] = useState<ApprovalRequest[]>([
        {
            id: "apr-001",
            type: "LOAN",
            requestCode: "LOAN-2026-01-003",
            assetInfo: "Máy chiếu Epson",
            requestedBy: "Nguyễn Văn A",
            requestDate: "2026-01-20",
            priority: "MEDIUM",
            status: "PENDING",
            details: "Mượn cho hội nghị khách hàng",
        },
        {
            id: "apr-002",
            type: "MAINTENANCE",
            requestCode: "MNT-2026-01-005",
            assetInfo: "Máy in HP LaserJet",
            requestedBy: "Trần Thị B",
            requestDate: "2026-01-21",
            priority: "HIGH",
            status: "PENDING",
            details: "Sửa chữa lỗi kẹt giấy",
        },
        {
            id: "apr-003",
            type: "RETURN",
            requestCode: "RTN-2026-01-002",
            assetInfo: "Laptop Dell Latitude",
            requestedBy: "Lê Văn C",
            requestDate: "2026-01-19",
            priority: "LOW",
            status: "PENDING",
            details: "Trả về kho sau khi hoàn thành dự án",
        },
        {
            id: "apr-004",
            type: "WAREHOUSE_TRANSFER",
            requestCode: "WT-2026-01-004",
            assetInfo: "50 tài sản văn phòng",
            requestedBy: "Phạm Thị D",
            requestDate: "2026-01-22",
            priority: "HIGH",
            status: "PENDING",
            details: "Chuyển kho Hà Nội sang TP.HCM",
        },
        {
            id: "apr-005",
            type: "COMPENSATION",
            requestCode: "CMP-2026-01-001",
            assetInfo: "Bàn làm việc gỗ",
            requestedBy: "Hoàng Văn E",
            requestDate: "2026-01-18",
            priority: "MEDIUM",
            status: "PENDING",
            details: "Bồi thường do hư hỏng trong quá trình sử dụng",
        },
        {
            id: "apr-006",
            type: "DISPOSAL",
            requestCode: "TH-2026-01-004",
            assetInfo: "Máy tính cũ",
            requestedBy: "Vũ Thị F",
            requestDate: "2026-01-17",
            priority: "LOW",
            status: "PENDING",
            details: "Tiêu hủy máy tính hỏng không sửa được",
        },
    ]);

    const handleApprove = (id: string) => {
        if (confirm("Xác nhận phê duyệt yêu cầu này?")) {
            setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: "APPROVED" as const } : a)));
        }
    };

    const handleReject = (id: string) => {
        if (confirm("Xác nhận từ chối yêu cầu này?")) {
            setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: "REJECTED" as const } : a)));
        }
    };

    const getTypeLabel = (type: ApprovalRequest["type"]) => {
        const labels = {
            LOAN: "Cho mượn",
            MAINTENANCE: "Bảo trì",
            RETURN: "Trả kho",
            WAREHOUSE_TRANSFER: "Điều chuyển kho",
            COMPENSATION: "Bồi hoàn",
            DISPOSAL: "Tiêu hủy",
        };
        return labels[type];
    };

    const getTypeColor = (type: ApprovalRequest["type"]) => {
        const colors = {
            LOAN: "bg-blue-100 text-blue-800",
            MAINTENANCE: "bg-yellow-100 text-yellow-800",
            RETURN: "bg-green-100 text-green-800",
            WAREHOUSE_TRANSFER: "bg-purple-100 text-purple-800",
            COMPENSATION: "bg-orange-100 text-orange-800",
            DISPOSAL: "bg-red-100 text-red-800",
        };
        return colors[type];
    };

    const filterByStatus = (status: ApprovalRequest["status"]) => approvals.filter((a) => a.status === status);
    const pendingApprovals = filterByStatus("PENDING");
    const approvedApprovals = filterByStatus("APPROVED");
    const rejectedApprovals = filterByStatus("REJECTED");

    const ApprovalTable = ({ items }: { items: ApprovalRequest[] }) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Loại</TableHead>
                    <TableHead>Mã yêu cầu</TableHead>
                    <TableHead>Tài sản</TableHead>
                    <TableHead>Người yêu cầu</TableHead>
                    <TableHead>Ngày yêu cầu</TableHead>
                    <TableHead>Mức độ</TableHead>
                    <TableHead>Chi tiết</TableHead>
                    <TableHead>Thao tác</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                            Không có yêu cầu nào
                        </TableCell>
                    </TableRow>
                ) : (
                    items.map((approval) => (
                        <TableRow key={approval.id}>
                            <TableCell>
                                <Badge className={getTypeColor(approval.type)}>{getTypeLabel(approval.type)}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{approval.requestCode}</TableCell>
                            <TableCell>{approval.assetInfo}</TableCell>
                            <TableCell>{approval.requestedBy}</TableCell>
                            <TableCell>{approval.requestDate}</TableCell>
                            <TableCell>
                                <Badge variant={approval.priority === "HIGH" ? "destructive" : approval.priority === "MEDIUM" ? "secondary" : "outline"}>
                                    {approval.priority}
                                </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">{approval.details}</TableCell>
                            <TableCell>
                                {approval.status === "PENDING" ? (
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" onClick={() => handleApprove(approval.id)}>
                                            <CheckCircle2 className="mr-1 h-4 w-4" />
                                            Duyệt
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleReject(approval.id)}>
                                            <XCircle className="mr-1 h-4 w-4" />
                                            Từ chối
                                        </Button>
                                    </div>
                                ) : (
                                    <Badge variant={approval.status === "APPROVED" ? "default" : "destructive"}>
                                        {approval.status === "APPROVED" ? "Đã duyệt" : "Đã từ chối"}
                                    </Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <ClipboardCheck className="h-6 w-6" />
                        Phê duyệt yêu cầu
                    </h1>
                    <p className="text-muted-foreground">Quản lý tất cả yêu cầu chờ phê duyệt</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Chờ duyệt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{pendingApprovals.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Đã duyệt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{approvedApprovals.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Đã từ chối</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{rejectedApprovals.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Tổng yêu cầu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{approvals.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Yêu cầu phê duyệt</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pending">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="pending">Chờ duyệt ({pendingApprovals.length})</TabsTrigger>
                            <TabsTrigger value="approved">Đã duyệt ({approvedApprovals.length})</TabsTrigger>
                            <TabsTrigger value="rejected">Đã từ chối ({rejectedApprovals.length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="pending" className="mt-4">
                            <ApprovalTable items={pendingApprovals} />
                        </TabsContent>
                        <TabsContent value="approved" className="mt-4">
                            <ApprovalTable items={approvedApprovals} />
                        </TabsContent>
                        <TabsContent value="rejected" className="mt-4">
                            <ApprovalTable items={rejectedApprovals} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
