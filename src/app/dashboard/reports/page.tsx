"use client";

import { useAppStore } from "@/lib/store";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function ReportsPage() {
    const assets = useAppStore((state) => state.assets);

    const statusData = useMemo(() => {
        const counts = assets.reduce(
            (acc, curr) => {
                acc[curr.status] = (acc[curr.status] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [assets]);

    const valueByLocationData = useMemo(() => {
        const values = assets.reduce(
            (acc, curr) => {
                acc[curr.location] = (acc[curr.location] || 0) + curr.price;
                return acc;
            },
            {} as Record<string, number>,
        );

        return Object.entries(values).map(([name, value]) => ({ name, value }));
    }, [assets]);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">Báo cáo Tổng hợp</h1>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Cơ cấu theo Trạng thái</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tổng giá trị theo Vị trí</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={valueByLocationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value as number)}
                                />
                                <Legend />
                                <Bar dataKey="value" name="Tổng giá trị" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Tổng tài sản</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{assets.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Tổng nguyên giá</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(assets.reduce((sum, a) => sum + a.price, 0))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
