"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
    {
        name: "T1",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "T2",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "T3",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "T4",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "T5",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "T6",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "T7",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "T8",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "T9",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "T10",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "T11",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "T12",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
];

export default function ReportsPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">Báo cáo thống kê</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng tài sản</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">+20.1% so với tháng trước</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang sử dụng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">890</div>
                        <p className="text-xs text-muted-foreground">+180.1% so với tháng trước</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang bảo trì</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">-19% so với tháng trước</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Thanh lý</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">573</div>
                        <p className="text-xs text-muted-foreground">+201 kể từ đầu năm</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Biểu đồ tăng trưởng tài sản</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                            <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
