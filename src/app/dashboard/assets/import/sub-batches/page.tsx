"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Package } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

interface SubBatch {
    id: string;
    parentBatchCode: string;
    subBatchCode: string;
    department: string;
    itemCount: number;
    value: number;
    status: string;
    createdDate: string;
}

export default function SubBatchPage() {
    const [subBatches] = useState<SubBatch[]>([
        {
            id: "sub-001",
            parentBatchCode: "LOT-2026-01-001",
            subBatchCode: "LOT-2026-01-001-A",
            department: "Phòng IT",
            itemCount: 5,
            value: 80000000,
            status: "COMPLETED",
            createdDate: "2026-01-16",
        },
        {
            id: "sub-002",
            parentBatchCode: "LOT-2026-01-001",
            subBatchCode: "LOT-2026-01-001-B",
            department: "Phòng Kế toán",
            itemCount: 10,
            value: 170000000,
            status: "COMPLETED",
            createdDate: "2026-01-16",
        },
        {
            id: "sub-003",
            parentBatchCode: "LOT-2026-01-002",
            subBatchCode: "LOT-2026-01-002-A",
            department: "Phòng Nhân sự",
            itemCount: 15,
            value: 300000000,
            status: "PROCESSING",
            createdDate: "2026-01-20",
        },
        {
            id: "sub-004",
            parentBatchCode: "LOT-2026-01-002",
            subBatchCode: "LOT-2026-01-002-B",
            department: "Phòng Marketing",
            itemCount: 10,
            value: 200000000,
            status: "PENDING",
            createdDate: "2026-01-20",
        },
    ]);

    const handleExport = () => {
        const exportData = subBatches.map((sub) => ({
            "Mã lô cha": sub.parentBatchCode,
            "Mã phiếu con": sub.subBatchCode,
            "Phòng ban": sub.department,
            "Số lượng": sub.itemCount,
            "Giá trị": sub.value,
            "Trạng thái": sub.status === "COMPLETED" ? "Hoàn thành" : sub.status === "PROCESSING" ? "Đang xử lý" : "Chờ xử lý",
            "Ngày tạo": sub.createdDate,
        }));
        exportToExcel(exportData, `Phieu_nhap_con_${new Date().toISOString().slice(0, 10)}`, "Phiếu con");
    };

    const groupedByParent = subBatches.reduce(
        (acc, sub) => {
            if (!acc[sub.parentBatchCode]) {
                acc[sub.parentBatchCode] = [];
            }
            acc[sub.parentBatchCode].push(sub);
            return acc;
        },
        {} as Record<string, SubBatch[]>,
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <FileText className="h-6 w-6" />
                        Phiếu nhập hàng hóa con
                    </h1>
                    <p className="text-muted-foreground">Theo dõi phiếu nhập đã được tách từ lô chính</p>
                </div>
                <Button onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Xuất Excel
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Tổng phiếu con</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{subBatches.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Hoàn thành</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{subBatches.filter((s) => s.status === "COMPLETED").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Đang xử lý</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{subBatches.filter((s) => s.status === "PROCESSING").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Tổng giá trị</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">
                            {new Intl.NumberFormat("vi-VN", { notation: "compact", style: "currency", currency: "VND" }).format(
                                subBatches.reduce((sum, s) => sum + s.value, 0),
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {Object.entries(groupedByParent).map(([parentCode, subs]) => (
                <Card key={parentCode}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Lô chính: {parentCode}
                        </CardTitle>
                        <CardDescription>
                            {subs.length} phiếu con · Tổng:{" "}
                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subs.reduce((sum, s) => sum + s.value, 0))}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã phiếu con</TableHead>
                                    <TableHead>Phòng ban</TableHead>
                                    <TableHead>Số lượng</TableHead>
                                    <TableHead>Giá trị</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subs.map((sub) => (
                                    <TableRow key={sub.id}>
                                        <TableCell className="font-medium">{sub.subBatchCode}</TableCell>
                                        <TableCell>{sub.department}</TableCell>
                                        <TableCell>{sub.itemCount}</TableCell>
                                        <TableCell>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(sub.value)}</TableCell>
                                        <TableCell>{sub.createdDate}</TableCell>
                                        <TableCell>
                                            <Badge variant={sub.status === "COMPLETED" ? "default" : sub.status === "PROCESSING" ? "secondary" : "outline"}>
                                                {sub.status === "COMPLETED" ? "Hoàn thành" : sub.status === "PROCESSING" ? "Đang xử lý" : "Chờ xử lý"}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
