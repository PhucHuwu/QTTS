"use client";

import { useAppStore, AppState } from "@/lib/store";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Asset } from "@/types/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { Calculator, Download, Play, CheckCircle2 } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

const toVND = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

interface DepreciationPeriod {
    id: string;
    periodCode: string;
    month: string;
    year: string;
    status: "DRAFT" | "CALCULATED" | "APPROVED" | "POSTED";
    totalDepreciation: number;
    assetCount: number;
    createdDate: string;
    approvedDate?: string;
}

export default function DepreciationPage() {
    const allAssets = useAppStore((state: AppState) => state.assets);
    const assets = useMemo(() => allAssets.filter((a) => a.status === "ACTIVE" || a.status === "MAINTENANCE"), [allAssets]);

    const [periods, setPeriods] = useState<DepreciationPeriod[]>([
        {
            id: "dep-001",
            periodCode: "DEP-2025-12",
            month: "12",
            year: "2025",
            status: "POSTED",
            totalDepreciation: 125000000,
            assetCount: 45,
            createdDate: "2025-12-31",
            approvedDate: "2026-01-05",
        },
        {
            id: "dep-002",
            periodCode: "DEP-2026-01",
            month: "01",
            year: "2026",
            status: "APPROVED",
            totalDepreciation: 130000000,
            assetCount: 48,
            createdDate: "2026-01-20",
            approvedDate: "2026-01-21",
        },
        {
            id: "dep-003",
            periodCode: "DEP-2026-02",
            month: "02",
            year: "2026",
            status: "DRAFT",
            totalDepreciation: 0,
            assetCount: 0,
            createdDate: "2026-01-22",
        },
    ]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const now = new Date();

    const calculatedData = useMemo(
        () =>
            assets.map((a) => {
                const purchaseDate = new Date(a.purchaseDate);
                const yearsUsed = (now.getTime() - purchaseDate.getTime()) / (1000 * 3600 * 24 * 365);
                const initialPrice = a.price || 0;
                const depreciationRate = 0.2;
                const depreciatedAmount = initialPrice * depreciationRate * yearsUsed;
                const monthlyDepreciation = (initialPrice * depreciationRate) / 12;
                const currentValue = Math.max(0, initialPrice - depreciatedAmount);

                return {
                    ...a,
                    yearsUsed: yearsUsed.toFixed(1),
                    currentValue,
                    depreciatedAmount,
                    monthlyDepreciation,
                };
            }),
        [assets, now],
    );

    const columns: ColumnDef<Asset & { yearsUsed: string; currentValue: number; monthlyDepreciation: number; depreciatedAmount: number }>[] = [
        { accessorKey: "code", header: "Mã TS" },
        { accessorKey: "name", header: "Tên tài sản" },
        {
            accessorKey: "price",
            header: "Giá trị gốc",
            cell: ({ row }) => toVND(row.original.price),
        },
        {
            accessorKey: "yearsUsed",
            header: "Năm SD",
            cell: ({ row }) => \`\${row.original.yearsUsed} năm\`,
        },
        {
            accessorKey: "monthlyDepreciation",
            header: "KH/tháng",
            cell: ({ row }) => <span className="text-orange-600 font-medium">{toVND(row.original.monthlyDepreciation)}</span>,
        },
        {
            accessorKey: "depreciatedAmount",
            header: "Đã KH",
            cell: ({ row }) => <span className="text-red-600">{toVND(row.original.depreciatedAmount)}</span>,
        },
        {
            accessorKey: "currentValue",
            header: "Còn lại",
            cell: ({ row }) => <span className="font-bold text-green-600">{toVND(row.original.currentValue)}</span>,
        },
    ];

    const handleCalculate = (periodId: string) => {
        if (confirm("Chạy tính khấu hao cho kỳ này?")) {
            const totalDep = calculatedData.reduce((sum, a) => sum + a.monthlyDepreciation, 0);
            setPeriods(
                periods.map((p) =>
                    p.id === periodId
                        ? {
                              ...p,
                              status: "CALCULATED" as const,
                              totalDepreciation: totalDep,
                              assetCount: calculatedData.length,
                          }
                        : p,
                ),
            );
        }
    };

    const handleApprove = (periodId: string) => {
        if (confirm("Phê duyệt kỳ khấu hao này?")) {
            setPeriods(
                periods.map((p) =>
                    p.id === periodId
                        ? {
                              ...p,
                              status: "APPROVED" as const,
                              approvedDate: new Date().toISOString().slice(0, 10),
                          }
                        : p,
                ),
            );
        }
    };

    const handlePost = (periodId: string) => {
        if (confirm("Ghi sổ khấu hao và cập nhật thẻ tài sản?")) {
            setPeriods(periods.map((p) => (p.id === periodId ? { ...p, status: "POSTED" as const } : p)));
        }
    };

    const handleExport = () => {
        const exportData = calculatedData.map((a) => ({
            "Mã TS": a.code,
            "Tên tài sản": a.name,
            "Giá trị gốc": a.price,
            "Năm sử dụng": a.yearsUsed,
            "Khấu hao/tháng": a.monthlyDepreciation,
            "Đã khấu hao": a.depreciatedAmount,
            "Giá trị còn lại": a.currentValue,
        }));
        exportToExcel(exportData, \`Khau_hao_tai_san_\${new Date().toISOString().slice(0, 10)}\`, "Khấu hao");
    };

    const handleExportPeriod = (period: DepreciationPeriod) => {
        const exportData = [
            {
                "Mã kỳ": period.periodCode,
                "Tháng": period.month,
                "Năm": period.year,
                "Tổng khấu hao": period.totalDepreciation,
                "Số tài sản": period.assetCount,
                "Trạng thái": period.status,
                "Ngày tạo": period.createdDate,
                "Ngày duyệt": period.approvedDate || "",
            },
        ];
        exportToExcel(exportData, \`Ky_khau_hao_\${period.periodCode}\`, "Kỳ khấu hao");
    };

    const handleCreatePeriod = () => {
        const now = new Date();
        const newPeriod: DepreciationPeriod = {
            id: \`dep-\${Date.now()}\`,
            periodCode: \`DEP-\${now.getFullYear()}-\${String(now.getMonth() + 1).padStart(2, "0")}\`,
            month: String(now.getMonth() + 1).padStart(2, "0"),
            year: String(now.getFullYear()),
            status: "DRAFT",
            totalDepreciation: 0,
            assetCount: 0,
            createdDate: now.toISOString().slice(0, 10),
        };
        setPeriods([...periods, newPeriod]);
        setIsCreateOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Calculator className="h-6 w-6" />
                        Tính khấu hao tài sản
                    </h1>
                    <p className="text-muted-foreground">Quản lý và tính toán khấu hao tài sản cố định</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất chi tiết
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Play className="mr-2 h-4 w-4" />
                                Tạo kỳ khấu hao
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo kỳ khấu hao mới</DialogTitle>
                                <DialogDescription>Tạo kỳ khấu hao cho tháng hiện tại</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <p className="text-sm text-muted-foreground">
                                    Hệ thống sẽ tạo kỳ khấu hao cho tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
                                </p>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreatePeriod}>Tạo kỳ</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Tổng tài sản</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{calculatedData.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Giá trị gốc</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">
                            {new Intl.NumberFormat("vi-VN", { notation: "compact", style: "currency", currency: "VND" }).format(
                                calculatedData.reduce((sum, a) => sum + a.price, 0),
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Đã khấu hao</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-red-600">
                            {new Intl.NumberFormat("vi-VN", { notation: "compact", style: "currency", currency: "VND" }).format(
                                calculatedData.reduce((sum, a) => sum + a.depreciatedAmount, 0),
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Giá trị còn lại</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-green-600">
                            {new Intl.NumberFormat("vi-VN", { notation: "compact", style: "currency", currency: "VND" }).format(
                                calculatedData.reduce((sum, a) => sum + a.currentValue, 0),
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách kỳ khấu hao</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {periods.map((period) => (
                            <div key={period.id} className="flex items-center justify-between border rounded-lg p-4">
                                <div className="space-y-1">
                                    <div className="font-semibold">{period.periodCode}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Tháng {period.month}/{period.year} • {period.assetCount} tài sản
                                    </div>
                                    {period.totalDepreciation > 0 && (
                                        <div className="text-sm font-medium text-orange-600">{toVND(period.totalDepreciation)}</div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant={
                                            period.status === "POSTED"
                                                ? "default"
                                                : period.status === "APPROVED"
                                                  ? "secondary"
                                                  : period.status === "CALCULATED"
                                                    ? "outline"
                                                    : "outline"
                                        }
                                    >
                                        {period.status === "DRAFT"
                                            ? "Nháp"
                                            : period.status === "CALCULATED"
                                              ? "Đã tính"
                                              : period.status === "APPROVED"
                                                ? "Đã duyệt"
                                                : "Đã ghi sổ"}
                                    </Badge>
                                    <div className="flex items-center gap-2">
                                        {period.status === "DRAFT" && (
                                            <Button size="sm" onClick={() => handleCalculate(period.id)}>
                                                <Play className="mr-1 h-3 w-3" />
                                                Chạy tính
                                            </Button>
                                        )}
                                        {period.status === "CALCULATED" && (
                                            <Button size="sm" onClick={() => handleApprove(period.id)}>
                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                                Phê duyệt
                                            </Button>
                                        )}
                                        {period.status === "APPROVED" && (
                                            <Button size="sm" onClick={() => handlePost(period.id)}>
                                                Ghi sổ
                                            </Button>
                                        )}
                                        <Button size="sm" variant="outline" onClick={() => handleExportPeriod(period)}>
                                            <Download className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Chi tiết khấu hao tài sản</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={calculatedData} />
                </CardContent>
            </Card>
        </div>
    );
}
