"use client";

import { useAppStore, AppState } from "@/lib/store";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Asset } from "@/types/mock";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";

// Helper for currency
const toVND = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export default function DepreciationPage() {
    const allAssets = useAppStore((state: AppState) => state.assets);

    // Stable filter using useMemo
    const assets = useMemo(() => allAssets.filter((a) => a.status === "ACTIVE" || a.status === "MAINTENANCE"), [allAssets]);

    // Mock calculation: Straight line 5 years (20% per year)
    // Current Value = Original Price - (Price * 20% * YearsUsed)
    const now = new Date();

    const calculatedData = useMemo(
        () =>
            assets.map((a) => {
                const purchaseDate = new Date(a.purchaseDate);
                const yearsUsed = (now.getTime() - purchaseDate.getTime()) / (1000 * 3600 * 24 * 365);

                // Safety check for NaN
                const initialPrice = a.price || 0;
                const depreciationRate = 0.2; // 20%
                const depreciatedAmount = initialPrice * depreciationRate * yearsUsed;

                // Ensure value doesn't go below 0
                const currentValue = Math.max(0, initialPrice - depreciatedAmount);

                return {
                    ...a,
                    yearsUsed: yearsUsed.toFixed(1),
                    currentValue,
                    depreciatedAmount,
                };
            }),
        [assets],
    ); // now is technically changing but only on mount/render, acceptable for this mock

    const columns: ColumnDef<Asset & { yearsUsed: string; currentValue: number }>[] = [
        { accessorKey: "code", header: "Mã TS" },
        { accessorKey: "name", header: "Tên tài sản" },
        {
            accessorKey: "price",
            header: "Nguyên giá",
            cell: ({ row }) => toVND(row.original.price),
        },
        {
            accessorKey: "purchaseDate",
            header: "Ngày mua",
            cell: ({ row }) => new Date(row.original.purchaseDate).toLocaleDateString("vi-VN"),
        },
        {
            accessorKey: "yearsUsed",
            header: "Số năm SD",
            cell: ({ row }) => `${row.original.yearsUsed} năm`,
        },
        {
            accessorKey: "currentValue",
            header: "Giá trị còn lại",
            cell: ({ row }) => <span className="font-bold text-blue-600">{toVND(row.original.currentValue)}</span>,
        },
    ];

    const totalOriginal = calculatedData.reduce((acc, curr) => acc + (curr.price || 0), 0);
    const totalCurrent = calculatedData.reduce((acc, curr) => acc + (curr.currentValue || 0), 0);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">Tính khấu hao tài sản</h1>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm font-medium text-muted-foreground">Tổng nguyên giá</div>
                        <div className="text-2xl font-bold">{toVND(totalOriginal)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm font-medium text-muted-foreground">Tổng giá trị còn lại</div>
                        <div className="text-2xl font-bold text-blue-600">{toVND(totalCurrent)}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border p-4">
                <DataTable columns={columns} data={calculatedData} />
            </div>
        </div>
    );
}
