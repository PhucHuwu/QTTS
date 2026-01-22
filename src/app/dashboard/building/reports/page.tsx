"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, DollarSign, Users, Download, Calendar, FileText } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { exportToExcel } from "@/lib/exportUtils";

interface RevenueReport {
    period: string;
    rental: number;
    services: number;
    parking: number;
    other: number;
    total: number;
    growth: number;
}

interface ExpenseReport {
    period: string;
    electricity: number;
    water: number;
    maintenance: number;
    salaries: number;
    security: number;
    cleaning: number;
    other: number;
    total: number;
}

interface DebtReport {
    tenantName: string;
    contractNo: string;
    location: string;
    amount: number;
    months: number;
    oldestPeriod: string;
    status: string;
}

interface MaintenanceReport {
    equipment: string;
    category: string;
    totalMaintenance: number;
    totalCost: number;
    avgDuration: number;
    lastMaintenance: string;
    nextSchedule: string;
}

interface TenantReport {
    name: string;
    contractNo: string;
    location: string;
    area: number;
    rentPerMonth: number;
    startDate: string;
    endDate: string;
    paymentStatus: string;
}

export default function BuildingReportsPage() {
    const [activeTab, setActiveTab] = useState("revenue");
    const [periodType, setPeriodType] = useState("monthly");
    const [selectedPeriod, setSelectedPeriod] = useState("2024-02");

    // Mock data
    const mockRevenue: RevenueReport[] = [
        { period: "2024-01", rental: 360000000, services: 45000000, parking: 15000000, other: 10000000, total: 430000000, growth: 5.2 },
        { period: "2024-02", rental: 380000000, services: 48000000, parking: 16000000, other: 12000000, total: 456000000, growth: 6.0 },
        { period: "2023-Q4", rental: 1050000000, services: 135000000, parking: 45000000, other: 30000000, total: 1260000000, growth: 4.5 },
    ];

    const mockExpenses: ExpenseReport[] = [
        {
            period: "2024-01",
            electricity: 75000000,
            water: 15000000,
            maintenance: 45000000,
            salaries: 120000000,
            security: 30000000,
            cleaning: 25000000,
            other: 20000000,
            total: 330000000,
        },
        {
            period: "2024-02",
            electricity: 78000000,
            water: 16000000,
            maintenance: 52000000,
            salaries: 120000000,
            security: 30000000,
            cleaning: 25000000,
            other: 18000000,
            total: 339000000,
        },
        {
            period: "2023-Q4",
            electricity: 220000000,
            water: 45000000,
            maintenance: 140000000,
            salaries: 360000000,
            security: 90000000,
            cleaning: 75000000,
            other: 55000000,
            total: 985000000,
        },
    ];

    const mockDebtReport: DebtReport[] = [
        {
            tenantName: "Công ty TNHH Thương mại DEF",
            contractNo: "HĐ-T-2022-015",
            location: "Tầng 3",
            amount: 135000000,
            months: 3,
            oldestPeriod: "2023-12",
            status: "IN_PROGRESS",
        },
    ];

    const mockMaintenanceReport: MaintenanceReport[] = [
        {
            equipment: "Thang máy số 1",
            category: "ELEVATOR",
            totalMaintenance: 6,
            totalCost: 30000000,
            avgDuration: 4,
            lastMaintenance: "2024-02-01",
            nextSchedule: "2024-04-01",
        },
        {
            equipment: "Điều hòa trung tâm - Tầng 5",
            category: "AC",
            totalMaintenance: 4,
            totalCost: 28000000,
            avgDuration: 5,
            lastMaintenance: "2024-02-15",
            nextSchedule: "2024-03-15",
        },
        {
            equipment: "Hệ thống chữa cháy",
            category: "FIRE",
            totalMaintenance: 1,
            totalCost: 12000000,
            avgDuration: 8,
            lastMaintenance: "2024-01-10",
            nextSchedule: "2025-01-10",
        },
    ];

    const mockTenantReport: TenantReport[] = [
        {
            name: "Công ty TNHH Công nghệ ABC",
            contractNo: "HĐ-T-2023-001",
            location: "Tầng 5",
            area: 250,
            rentPerMonth: 75000000,
            startDate: "2023-01-15",
            endDate: "2025-01-15",
            paymentStatus: "CURRENT",
        },
        {
            name: "Công ty CP Tài chính XYZ",
            contractNo: "HĐ-T-2023-006",
            location: "Tầng 8",
            area: 800,
            rentPerMonth: 240000000,
            startDate: "2023-06-01",
            endDate: "2025-06-01",
            paymentStatus: "CURRENT",
        },
        {
            name: "Công ty TNHH Thương mại DEF",
            contractNo: "HĐ-T-2022-015",
            location: "Tầng 3",
            area: 150,
            rentPerMonth: 45000000,
            startDate: "2022-03-01",
            endDate: "2024-03-01",
            paymentStatus: "OVERDUE",
        },
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    };

    const revenueColumns = [
        { header: "Kỳ", accessorKey: "period" },
        {
            header: "Tiền thuê",
            accessorKey: "rental",
            cell: ({ row }: any) => formatCurrency(row.original.rental),
        },
        {
            header: "Dịch vụ",
            accessorKey: "services",
            cell: ({ row }: any) => formatCurrency(row.original.services),
        },
        {
            header: "Gửi xe",
            accessorKey: "parking",
            cell: ({ row }: any) => formatCurrency(row.original.parking),
        },
        {
            header: "Khác",
            accessorKey: "other",
            cell: ({ row }: any) => formatCurrency(row.original.other),
        },
        {
            header: "Tổng cộng",
            accessorKey: "total",
            cell: ({ row }: any) => <span className="font-bold">{formatCurrency(row.original.total)}</span>,
        },
        {
            header: "Tăng trưởng",
            accessorKey: "growth",
            cell: ({ row }: any) => (
                <span className={row.original.growth > 0 ? "text-green-600" : "text-red-600"}>
                    {row.original.growth > 0 ? "+" : ""}
                    {row.original.growth}%
                </span>
            ),
        },
    ];

    const expenseColumns = [
        { header: "Kỳ", accessorKey: "period" },
        {
            header: "Điện",
            accessorKey: "electricity",
            cell: ({ row }: any) => formatCurrency(row.original.electricity),
        },
        {
            header: "Nước",
            accessorKey: "water",
            cell: ({ row }: any) => formatCurrency(row.original.water),
        },
        {
            header: "Bảo trì",
            accessorKey: "maintenance",
            cell: ({ row }: any) => formatCurrency(row.original.maintenance),
        },
        {
            header: "Lương",
            accessorKey: "salaries",
            cell: ({ row }: any) => formatCurrency(row.original.salaries),
        },
        {
            header: "Khác",
            accessorKey: "other",
            cell: ({ row }: any) => formatCurrency(row.original.other),
        },
        {
            header: "Tổng cộng",
            accessorKey: "total",
            cell: ({ row }: any) => <span className="font-bold">{formatCurrency(row.original.total)}</span>,
        },
    ];

    const debtColumns = [
        { header: "Khách thuê", accessorKey: "tenantName" },
        { header: "Số HĐ", accessorKey: "contractNo" },
        { header: "Vị trí", accessorKey: "location" },
        {
            header: "Số tiền nợ",
            accessorKey: "amount",
            cell: ({ row }: any) => <span className="font-bold text-red-600">{formatCurrency(row.original.amount)}</span>,
        },
        { header: "Số tháng", accessorKey: "months" },
        { header: "Nợ từ", accessorKey: "oldestPeriod" },
    ];

    const maintenanceColumns = [
        { header: "Thiết bị", accessorKey: "equipment" },
        { header: "Loại", accessorKey: "category" },
        { header: "Số lần BT", accessorKey: "totalMaintenance" },
        {
            header: "Tổng chi phí",
            accessorKey: "totalCost",
            cell: ({ row }: any) => formatCurrency(row.original.totalCost),
        },
        { header: "TB thời gian (h)", accessorKey: "avgDuration" },
        { header: "BT cuối", accessorKey: "lastMaintenance" },
        { header: "BT tiếp", accessorKey: "nextSchedule" },
    ];

    const tenantColumns = [
        { header: "Khách thuê", accessorKey: "name" },
        { header: "Số HĐ", accessorKey: "contractNo" },
        { header: "Vị trí", accessorKey: "location" },
        {
            header: "Diện tích",
            accessorKey: "area",
            cell: ({ row }: any) => `${row.original.area} m²`,
        },
        {
            header: "Tiền thuê/tháng",
            accessorKey: "rentPerMonth",
            cell: ({ row }: any) => formatCurrency(row.original.rentPerMonth),
        },
        { header: "Từ ngày", accessorKey: "startDate" },
        { header: "Đến ngày", accessorKey: "endDate" },
        {
            header: "Thanh toán",
            accessorKey: "paymentStatus",
            cell: ({ row }: any) => (
                <span className={row.original.paymentStatus === "CURRENT" ? "text-green-600" : "text-red-600"}>
                    {row.original.paymentStatus === "CURRENT" ? "Đúng hạn" : "Quá hạn"}
                </span>
            ),
        },
    ];

    // Calculate summary statistics
    const currentRevenue = mockRevenue.find((r) => r.period === selectedPeriod);
    const currentExpense = mockExpenses.find((e) => e.period === selectedPeriod);
    const profit = (currentRevenue?.total || 0) - (currentExpense?.total || 0);
    const profitMargin = currentRevenue ? (profit / currentRevenue.total) * 100 : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Báo cáo & thống kê</h1>
                <p className="text-muted-foreground">Báo cáo doanh thu, chi phí, công nợ và vận hành tòa nhà (UC-C11-C17)</p>
            </div>

            {/* Period Filter */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <Label className="text-sm font-medium">Loại kỳ báo cáo</Label>
                            <Select value={periodType} onValueChange={setPeriodType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Theo tháng</SelectItem>
                                    <SelectItem value="quarterly">Theo quý</SelectItem>
                                    <SelectItem value="yearly">Theo năm</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <Label className="text-sm font-medium">Chọn kỳ</Label>
                            <Input
                                type={periodType === "monthly" ? "month" : "text"}
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 items-end">
                            <Button>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Xem báo cáo
                            </Button>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Xuất PDF
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(currentRevenue?.total || 0)}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />+{currentRevenue?.growth || 0}% so với kỳ trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng chi phí</CardTitle>
                        <DollarSign className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(currentExpense?.total || 0)}</div>
                        <p className="text-xs text-muted-foreground">
                            {Math.round(((currentExpense?.total || 0) / (currentRevenue?.total || 1)) * 100)}% doanh thu
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lợi nhuận</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(profit)}</div>
                        <p className="text-xs text-muted-foreground">Biên lợi nhuận: {profitMargin.toFixed(1)}%</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Công nợ</CardTitle>
                        <Users className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(mockDebtReport.reduce((sum, d) => sum + d.amount, 0))}</div>
                        <p className="text-xs text-muted-foreground">{mockDebtReport.length} khách hàng nợ</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
                    <TabsTrigger value="expense">Chi phí</TabsTrigger>
                    <TabsTrigger value="comparison">So sánh DT/CP</TabsTrigger>
                    <TabsTrigger value="tenant-list">Danh sách khách</TabsTrigger>
                    <TabsTrigger value="debt">Công nợ</TabsTrigger>
                    <TabsTrigger value="maintenance">Bảo trì</TabsTrigger>
                </TabsList>

                <TabsContent value="revenue" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Báo cáo doanh thu (UC-C11)</CardTitle>
                                    <CardDescription>Chi tiết doanh thu theo từng nguồn</CardDescription>
                                </div>
                                <Button variant="outline" onClick={() => exportToExcel(mockRevenue, "bao-cao-doanh-thu")}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Xuất Excel
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={revenueColumns} data={mockRevenue} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="expense" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Báo cáo chi phí (UC-C12)</CardTitle>
                                    <CardDescription>Chi tiết chi phí vận hành theo loại</CardDescription>
                                </div>
                                <Button variant="outline" onClick={() => exportToExcel(mockExpenses, "bao-cao-chi-phi")}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Xuất Excel
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={expenseColumns} data={mockExpenses} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="comparison" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>So sánh doanh thu & chi phí (UC-C16)</CardTitle>
                                    <CardDescription>Phân tích lợi nhuận theo kỳ</CardDescription>
                                </div>
                                <Button variant="outline">
                                    <Download className="mr-2 h-4 w-4" />
                                    Xuất Excel
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockRevenue.map((rev, idx) => {
                                    const exp = mockExpenses[idx];
                                    const profit = rev.total - exp.total;
                                    const margin = (profit / rev.total) * 100;

                                    return (
                                        <div key={rev.period} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium">{rev.period}</h4>
                                                <span className={profit > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                                    {formatCurrency(profit)}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Doanh thu:</span>
                                                    <span className="font-medium text-green-600">{formatCurrency(rev.total)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Chi phí:</span>
                                                    <span className="font-medium text-red-600">{formatCurrency(exp.total)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Biên lợi nhuận:</span>
                                                    <span className="font-medium">{margin.toFixed(1)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tenant-list" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Danh sách khách thuê (UC-C13)</CardTitle>
                                    <CardDescription>Thông tin chi tiết khách thuê và hợp đồng</CardDescription>
                                </div>
                                <Button variant="outline" onClick={() => exportToExcel(mockTenantReport, "danh-sach-khach-thue")}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Xuất Excel
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={tenantColumns} data={mockTenantReport} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="debt" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Báo cáo công nợ (UC-C14)</CardTitle>
                                    <CardDescription>Theo dõi công nợ khách hàng</CardDescription>
                                </div>
                                <Button variant="outline" onClick={() => exportToExcel(mockDebtReport, "bao-cao-cong-no")}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Xuất Excel
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={debtColumns} data={mockDebtReport} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="maintenance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Báo cáo bảo trì (UC-C15)</CardTitle>
                                    <CardDescription>Thống kê chi phí và tần suất bảo trì thiết bị</CardDescription>
                                </div>
                                <Button variant="outline" onClick={() => exportToExcel(mockMaintenanceReport, "bao-cao-bao-tri")}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Xuất Excel
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={maintenanceColumns} data={mockMaintenanceReport} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
    return <label className={className}>{children}</label>;
}
