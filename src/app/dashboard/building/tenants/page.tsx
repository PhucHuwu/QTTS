"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, FileText, DollarSign, Plus, Search, Download, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { exportToExcel } from "@/lib/exportUtils";

interface Tenant {
    id: string;
    code: string;
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    taxCode: string;
    address: string;
    industry: string;
    status: "ACTIVE" | "INACTIVE" | "PENDING";
    joinDate: string;
    notes?: string;
}

interface RentalContract {
    id: string;
    contractNo: string;
    tenantId: string;
    tenantName: string;
    location: string;
    area: number;
    startDate: string;
    endDate: string;
    rentPerMonth: number;
    deposit: number;
    status: "ACTIVE" | "EXPIRING" | "EXPIRED" | "TERMINATED";
    paymentCycle: "MONTHLY" | "QUARTERLY" | "YEARLY";
    services: string[];
    notes?: string;
}

interface Payment {
    id: string;
    contractId: string;
    contractNo: string;
    tenantName: string;
    period: string;
    dueDate: string;
    amount: number;
    paidAmount: number;
    paidDate?: string;
    status: "PAID" | "PARTIAL" | "PENDING" | "OVERDUE";
    paymentMethod?: string;
    notes?: string;
}

interface Debt {
    id: string;
    tenantId: string;
    tenantName: string;
    totalDebt: number;
    oldestDebt: string;
    monthsOverdue: number;
    contactAttempts: number;
    lastContact: string;
    status: "PENDING" | "IN_PROGRESS" | "RESOLVED";
}

export default function BuildingTenantsPage() {
    const [activeTab, setActiveTab] = useState("tenants");
    const [searchTerm, setSearchTerm] = useState("");
    const [isTenantDialogOpen, setIsTenantDialogOpen] = useState(false);
    const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

    // Mock data
    const mockTenants: Tenant[] = [
        {
            id: "TEN001",
            code: "KH-001",
            name: "Công ty TNHH Công nghệ ABC",
            contactPerson: "Nguyễn Văn A",
            phone: "0901234567",
            email: "contact@abc.com",
            taxCode: "0123456789",
            address: "123 Đường ABC, Q1, TP.HCM",
            industry: "Công nghệ thông tin",
            status: "ACTIVE",
            joinDate: "2023-01-15",
            notes: "Khách hàng lâu năm, thanh toán đúng hạn",
        },
        {
            id: "TEN002",
            code: "KH-002",
            name: "Công ty CP Tài chính XYZ",
            contactPerson: "Trần Thị B",
            phone: "0907654321",
            email: "info@xyz.com",
            taxCode: "0987654321",
            address: "456 Đường XYZ, Q3, TP.HCM",
            industry: "Tài chính",
            status: "ACTIVE",
            joinDate: "2023-06-01",
            notes: "Thuê nhiều diện tích",
        },
        {
            id: "TEN003",
            code: "KH-003",
            name: "Công ty TNHH Thương mại DEF",
            contactPerson: "Lê Văn C",
            phone: "0909876543",
            email: "sales@def.com",
            taxCode: "0111222333",
            address: "789 Đường DEF, Q5, TP.HCM",
            industry: "Thương mại",
            status: "PENDING",
            joinDate: "2024-02-15",
            notes: "Đang trong giai đoạn bàn giao mặt bằng",
        },
    ];

    const mockContracts: RentalContract[] = [
        {
            id: "CTR001",
            contractNo: "HĐ-T-2023-001",
            tenantId: "TEN001",
            tenantName: "Công ty TNHH Công nghệ ABC",
            location: "Tầng 5, phòng 501-505",
            area: 250,
            startDate: "2023-01-15",
            endDate: "2025-01-15",
            rentPerMonth: 75000000,
            deposit: 150000000,
            status: "ACTIVE",
            paymentCycle: "MONTHLY",
            services: ["Điện", "Nước", "Internet", "Vệ sinh"],
        },
        {
            id: "CTR002",
            contractNo: "HĐ-T-2023-006",
            tenantId: "TEN002",
            tenantName: "Công ty CP Tài chính XYZ",
            location: "Tầng 8, toàn bộ",
            area: 800,
            startDate: "2023-06-01",
            endDate: "2025-06-01",
            rentPerMonth: 240000000,
            deposit: 480000000,
            status: "ACTIVE",
            paymentCycle: "QUARTERLY",
            services: ["Điện", "Nước", "Internet", "Vệ sinh", "Bảo vệ"],
        },
        {
            id: "CTR003",
            contractNo: "HĐ-T-2022-015",
            tenantId: "TEN003",
            tenantName: "Công ty TNHH Thương mại DEF",
            location: "Tầng 3, phòng 301-303",
            area: 150,
            startDate: "2022-03-01",
            endDate: "2024-03-01",
            rentPerMonth: 45000000,
            deposit: 90000000,
            status: "EXPIRING",
            paymentCycle: "MONTHLY",
            services: ["Điện", "Nước", "Vệ sinh"],
        },
    ];

    const mockPayments: Payment[] = [
        {
            id: "PAY001",
            contractId: "CTR001",
            contractNo: "HĐ-T-2023-001",
            tenantName: "Công ty TNHH Công nghệ ABC",
            period: "2024-02",
            dueDate: "2024-02-05",
            amount: 75000000,
            paidAmount: 75000000,
            paidDate: "2024-02-03",
            status: "PAID",
            paymentMethod: "Chuyển khoản",
        },
        {
            id: "PAY002",
            contractId: "CTR002",
            contractNo: "HĐ-T-2023-006",
            tenantName: "Công ty CP Tài chính XYZ",
            period: "2024-Q1",
            dueDate: "2024-01-05",
            amount: 720000000,
            paidAmount: 720000000,
            paidDate: "2024-01-04",
            status: "PAID",
            paymentMethod: "Chuyển khoản",
        },
        {
            id: "PAY003",
            contractId: "CTR003",
            contractNo: "HĐ-T-2022-015",
            tenantName: "Công ty TNHH Thương mại DEF",
            period: "2024-02",
            dueDate: "2024-02-05",
            amount: 45000000,
            paidAmount: 0,
            status: "OVERDUE",
            notes: "Chưa liên lạc được",
        },
        {
            id: "PAY004",
            contractId: "CTR001",
            contractNo: "HĐ-T-2023-001",
            tenantName: "Công ty TNHH Công nghệ ABC",
            period: "2024-03",
            dueDate: "2024-03-05",
            amount: 75000000,
            paidAmount: 0,
            status: "PENDING",
        },
    ];

    const mockDebts: Debt[] = [
        {
            id: "DEBT001",
            tenantId: "TEN003",
            tenantName: "Công ty TNHH Thương mại DEF",
            totalDebt: 135000000,
            oldestDebt: "2023-12",
            monthsOverdue: 3,
            contactAttempts: 5,
            lastContact: "2024-02-20",
            status: "IN_PROGRESS",
        },
    ];

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; icon?: any }> = {
            ACTIVE: { variant: "default", label: "Hoạt động", icon: CheckCircle },
            INACTIVE: { variant: "outline", label: "Không hoạt động" },
            PENDING: { variant: "secondary", label: "Chờ xử lý", icon: Clock },
            EXPIRING: { variant: "secondary", label: "Sắp hết hạn", icon: AlertCircle },
            EXPIRED: { variant: "destructive", label: "Đã hết hạn" },
            TERMINATED: { variant: "outline", label: "Đã chấm dứt" },
            PAID: { variant: "default", label: "Đã thanh toán", icon: CheckCircle },
            PARTIAL: { variant: "secondary", label: "Thanh toán 1 phần" },
            OVERDUE: { variant: "destructive", label: "Quá hạn", icon: AlertCircle },
            IN_PROGRESS: { variant: "secondary", label: "Đang xử lý" },
            RESOLVED: { variant: "default", label: "Đã giải quyết" },
        };
        const config = variants[status] || { variant: "outline" as const, label: status };
        const Icon = config.icon;
        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                {Icon && <Icon className="h-3 w-3" />}
                {config.label}
            </Badge>
        );
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    };

    const tenantColumns = [
        { header: "Mã KH", accessorKey: "code" },
        { header: "Tên công ty", accessorKey: "name" },
        { header: "Người liên hệ", accessorKey: "contactPerson" },
        { header: "Điện thoại", accessorKey: "phone" },
        { header: "Email", accessorKey: "email" },
        { header: "Lĩnh vực", accessorKey: "industry" },
        {
            header: "Trạng thái",
            accessorKey: "status",
            cell: ({ row }: any) => getStatusBadge(row.original.status),
        },
    ];

    const contractColumns = [
        { header: "Số HĐ", accessorKey: "contractNo" },
        { header: "Khách thuê", accessorKey: "tenantName" },
        { header: "Vị trí", accessorKey: "location" },
        {
            header: "Diện tích",
            accessorKey: "area",
            cell: ({ row }: any) => `${row.original.area} m²`,
        },
        { header: "Bắt đầu", accessorKey: "startDate" },
        { header: "Kết thúc", accessorKey: "endDate" },
        {
            header: "Tiền thuê/tháng",
            accessorKey: "rentPerMonth",
            cell: ({ row }: any) => formatCurrency(row.original.rentPerMonth),
        },
        {
            header: "Trạng thái",
            accessorKey: "status",
            cell: ({ row }: any) => getStatusBadge(row.original.status),
        },
    ];

    const paymentColumns = [
        { header: "Số HĐ", accessorKey: "contractNo" },
        { header: "Khách thuê", accessorKey: "tenantName" },
        { header: "Kỳ", accessorKey: "period" },
        { header: "Hạn TT", accessorKey: "dueDate" },
        {
            header: "Số tiền",
            accessorKey: "amount",
            cell: ({ row }: any) => formatCurrency(row.original.amount),
        },
        {
            header: "Đã TT",
            accessorKey: "paidAmount",
            cell: ({ row }: any) => formatCurrency(row.original.paidAmount),
        },
        { header: "Ngày TT", accessorKey: "paidDate" },
        {
            header: "Trạng thái",
            accessorKey: "status",
            cell: ({ row }: any) => getStatusBadge(row.original.status),
        },
    ];

    const debtColumns = [
        { header: "Khách thuê", accessorKey: "tenantName" },
        {
            header: "Tổng nợ",
            accessorKey: "totalDebt",
            cell: ({ row }: any) => formatCurrency(row.original.totalDebt),
        },
        { header: "Nợ lâu nhất", accessorKey: "oldestDebt" },
        { header: "Số tháng", accessorKey: "monthsOverdue" },
        { header: "Lần liên lạc", accessorKey: "contactAttempts" },
        { header: "Liên lạc cuối", accessorKey: "lastContact" },
        {
            header: "Trạng thái",
            accessorKey: "status",
            cell: ({ row }: any) => getStatusBadge(row.original.status),
        },
    ];

    const activeTenants = mockTenants.filter((t) => t.status === "ACTIVE").length;
    const activeContracts = mockContracts.filter((c) => c.status === "ACTIVE").length;
    const totalRevenue = mockPayments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.paidAmount, 0);
    const overduePayments = mockPayments.filter((p) => p.status === "OVERDUE").length;
    const totalDebt = mockDebts.reduce((sum, d) => sum + d.totalDebt, 0);
    const totalArea = mockContracts.filter((c) => c.status === "ACTIVE").reduce((sum, c) => sum + c.area, 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Quản lý khách thuê</h1>
                <p className="text-muted-foreground">Quản lý khách thuê, hợp đồng, thanh toán và công nợ (UC-C08-C10)</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Khách thuê</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeTenants}</div>
                        <p className="text-xs text-muted-foreground">Đang hoạt động</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hợp đồng</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeContracts}</div>
                        <p className="text-xs text-muted-foreground">Đang hiệu lực</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Diện tích</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalArea}</div>
                        <p className="text-xs text-muted-foreground">m² đã cho thuê</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalRevenue).replace("₫", "tr")}</div>
                        <p className="text-xs text-muted-foreground">Đã thu</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quá hạn</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overduePayments}</div>
                        <p className="text-xs text-muted-foreground">Thanh toán chưa thu</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Công nợ</CardTitle>
                        <DollarSign className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalDebt).replace("₫", "tr")}</div>
                        <p className="text-xs text-muted-foreground">{mockDebts.length} khách hàng</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="tenants">Khách thuê</TabsTrigger>
                    <TabsTrigger value="contracts">Hợp đồng</TabsTrigger>
                    <TabsTrigger value="payments">Thanh toán</TabsTrigger>
                    <TabsTrigger value="debts">Công nợ</TabsTrigger>
                </TabsList>

                <TabsContent value="tenants" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Danh sách khách thuê</CardTitle>
                                    <CardDescription>Quản lý thông tin khách thuê tòa nhà</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => setIsTenantDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Thêm khách thuê
                                    </Button>
                                    <Button variant="outline" onClick={() => exportToExcel(mockTenants, "khach-thue")}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Xuất Excel
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm kiếm khách thuê..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            <DataTable columns={tenantColumns} data={mockTenants} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contracts" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Hợp đồng thuê</CardTitle>
                                    <CardDescription>Quản lý hợp đồng thuê mặt bằng</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => setIsContractDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Thêm hợp đồng
                                    </Button>
                                    <Button variant="outline" onClick={() => exportToExcel(mockContracts, "hop-dong-thue")}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Xuất Excel
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={contractColumns} data={mockContracts} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Thanh toán</CardTitle>
                                    <CardDescription>Theo dõi các khoản thanh toán tiền thuê</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => setIsPaymentDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Ghi nhận thanh toán
                                    </Button>
                                    <Button variant="outline" onClick={() => exportToExcel(mockPayments, "thanh-toan")}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Xuất Excel
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={paymentColumns} data={mockPayments} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="debts" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Công nợ</CardTitle>
                                    <CardDescription>Theo dõi và quản lý công nợ khách hàng</CardDescription>
                                </div>
                                <Button variant="outline" onClick={() => exportToExcel(mockDebts, "cong-no")}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Xuất Excel
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={debtColumns} data={mockDebts} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <Dialog open={isTenantDialogOpen} onOpenChange={setIsTenantDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thêm khách thuê mới</DialogTitle>
                        <DialogDescription>Nhập thông tin khách thuê</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Mã khách hàng</Label>
                                <Input placeholder="VD: KH-001" />
                            </div>
                            <div className="space-y-2">
                                <Label>Mã số thuế</Label>
                                <Input placeholder="10 chữ số" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tên công ty</Label>
                            <Input placeholder="Tên đầy đủ công ty" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Người liên hệ</Label>
                                <Input placeholder="Họ và tên" />
                            </div>
                            <div className="space-y-2">
                                <Label>Số điện thoại</Label>
                                <Input placeholder="09xxxxxxxx" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" placeholder="email@company.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>Lĩnh vực</Label>
                                <Input placeholder="VD: Công nghệ thông tin" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Địa chỉ</Label>
                            <Textarea placeholder="Địa chỉ chi tiết..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTenantDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={() => setIsTenantDialogOpen(false)}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thêm hợp đồng thuê</DialogTitle>
                        <DialogDescription>Tạo hợp đồng thuê mặt bằng</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Số hợp đồng</Label>
                                <Input placeholder="VD: HĐ-T-2024-001" />
                            </div>
                            <div className="space-y-2">
                                <Label>Khách thuê</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn khách thuê" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockTenants.map((t) => (
                                            <SelectItem key={t.id} value={t.id}>
                                                {t.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Vị trí</Label>
                                <Input placeholder="VD: Tầng 5, phòng 501-505" />
                            </div>
                            <div className="space-y-2">
                                <Label>Diện tích (m²)</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ngày bắt đầu</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>Ngày kết thúc</Label>
                                <Input type="date" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tiền thuê/tháng (VNĐ)</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <Label>Tiền đặt cọc (VNĐ)</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsContractDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={() => setIsContractDialogOpen(false)}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Ghi nhận thanh toán</DialogTitle>
                        <DialogDescription>Cập nhật thông tin thanh toán tiền thuê</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Hợp đồng</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn hợp đồng" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockContracts.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.contractNo} - {c.tenantName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Kỳ thanh toán</Label>
                                <Input type="month" />
                            </div>
                            <div className="space-y-2">
                                <Label>Số tiền (VNĐ)</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ngày thanh toán</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phương thức</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn phương thức" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TRANSFER">Chuyển khoản</SelectItem>
                                        <SelectItem value="CASH">Tiền mặt</SelectItem>
                                        <SelectItem value="CHECK">Séc</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={() => setIsPaymentDialogOpen(false)}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
