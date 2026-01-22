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
import { FileText, Shield, Wrench, DollarSign, Building2, Plus, Search, Download, Edit, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { exportToExcel } from "@/lib/exportUtils";

interface Document {
    id: string;
    type: "LEGAL" | "EQUIPMENT" | "CONTRACT" | "INSURANCE" | "DESIGN";
    name: string;
    code: string;
    description: string;
    issueDate: string;
    expiryDate?: string;
    status: "VALID" | "EXPIRING" | "EXPIRED";
    department: string;
    storageLocation: string;
    fileUrl?: string;
    notes?: string;
}

interface Contract {
    id: string;
    type: "SERVICE" | "MAINTENANCE" | "SUPPLY" | "OUTSOURCE";
    contractNo: string;
    title: string;
    vendor: string;
    startDate: string;
    endDate: string;
    value: number;
    status: "ACTIVE" | "EXPIRING" | "EXPIRED" | "TERMINATED";
    serviceType: string;
    renewalDate?: string;
    notes?: string;
}

interface Insurance {
    id: string;
    policyNo: string;
    provider: string;
    type: string;
    coverage: string;
    startDate: string;
    endDate: string;
    premium: number;
    status: "ACTIVE" | "EXPIRING" | "EXPIRED";
    beneficiary: string;
    notes?: string;
}

interface OperatingCost {
    id: string;
    category: "ELECTRICITY" | "WATER" | "GAS" | "SECURITY" | "CLEANING" | "MAINTENANCE" | "OTHER";
    period: string;
    amount: number;
    unit: string;
    unitPrice: number;
    totalCost: number;
    supplier: string;
    invoiceNo: string;
    paymentDate: string;
    status: "PAID" | "PENDING" | "OVERDUE";
    notes?: string;
}

export default function BuildingDocumentsPage() {
    const [activeTab, setActiveTab] = useState("legal");
    const [searchTerm, setSearchTerm] = useState("");
    const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
    const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
    const [isInsuranceDialogOpen, setIsInsuranceDialogOpen] = useState(false);
    const [isCostDialogOpen, setIsCostDialogOpen] = useState(false);

    // Mock data
    const mockDocuments: Document[] = [
        {
            id: "DOC001",
            type: "LEGAL",
            name: "Giấy phép xây dựng",
            code: "XD-2023-001",
            description: "Giấy phép xây dựng tòa nhà văn phòng",
            issueDate: "2023-01-15",
            expiryDate: "2028-01-15",
            status: "VALID",
            department: "Phòng Kế hoạch",
            storageLocation: "Tủ hồ sơ A1",
            notes: "Cần gia hạn trước 6 tháng",
        },
        {
            id: "DOC002",
            type: "LEGAL",
            name: "Giấy chứng nhận PCCC",
            code: "PCCC-2023-002",
            description: "Giấy chứng nhận phòng cháy chữa cháy",
            issueDate: "2023-06-01",
            expiryDate: "2024-06-01",
            status: "EXPIRING",
            department: "Phòng Hành chính",
            storageLocation: "Tủ hồ sơ A2",
            notes: "Sắp hết hạn, cần gia hạn",
        },
        {
            id: "DOC003",
            type: "DESIGN",
            name: "Bản vẽ thiết kế hệ thống điện",
            code: "DESIGN-2023-001",
            description: "Thiết kế hệ thống điện tòa nhà",
            issueDate: "2022-12-01",
            status: "VALID",
            department: "Phòng Kỹ thuật",
            storageLocation: "Tủ hồ sơ B1",
        },
    ];

    const mockContracts: Contract[] = [
        {
            id: "CTR001",
            type: "SERVICE",
            contractNo: "HĐ-DV-2024-001",
            title: "Hợp đồng dịch vụ vệ sinh",
            vendor: "Công ty TNHH Vệ sinh ABC",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            value: 120000000,
            status: "ACTIVE",
            serviceType: "Vệ sinh văn phòng",
            renewalDate: "2024-11-01",
            notes: "Phục vụ 2 ca/ngày",
        },
        {
            id: "CTR002",
            type: "MAINTENANCE",
            contractNo: "HĐ-BT-2024-002",
            title: "Hợp đồng bảo trì thang máy",
            vendor: "Công ty CP Thang máy XYZ",
            startDate: "2024-01-15",
            endDate: "2025-01-15",
            value: 45000000,
            status: "ACTIVE",
            serviceType: "Bảo trì định kỳ thang máy",
            renewalDate: "2024-12-15",
            notes: "Bảo trì 6 thang máy",
        },
        {
            id: "CTR003",
            type: "SERVICE",
            contractNo: "HĐ-DV-2023-015",
            title: "Hợp đồng bảo vệ",
            vendor: "Công ty TNHH An ninh DEF",
            startDate: "2023-06-01",
            endDate: "2024-05-31",
            value: 180000000,
            status: "EXPIRING",
            serviceType: "Dịch vụ bảo vệ 24/7",
            renewalDate: "2024-04-01",
            notes: "Cần thương thảo gia hạn",
        },
    ];

    const mockInsurance: Insurance[] = [
        {
            id: "INS001",
            policyNo: "BH-TNDS-2024-001",
            provider: "Bảo hiểm AAA",
            type: "Bảo hiểm trách nhiệm dân sự",
            coverage: "Thiệt hại về người và tài sản",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            premium: 25000000,
            status: "ACTIVE",
            beneficiary: "Công ty XYZ",
            notes: "Mức bảo hiểm 5 tỷ đồng",
        },
        {
            id: "INS002",
            policyNo: "BH-CHAY-2024-002",
            provider: "Bảo hiểm BBB",
            type: "Bảo hiểm cháy nổ",
            coverage: "Tài sản tòa nhà",
            startDate: "2024-01-15",
            endDate: "2025-01-15",
            premium: 35000000,
            status: "ACTIVE",
            beneficiary: "Công ty XYZ",
            notes: "Mức bảo hiểm 50 tỷ đồng",
        },
    ];

    const mockCosts: OperatingCost[] = [
        {
            id: "COST001",
            category: "ELECTRICITY",
            period: "2024-01",
            amount: 15000,
            unit: "kWh",
            unitPrice: 2500,
            totalCost: 37500000,
            supplier: "Điện lực TP.HCM",
            invoiceNo: "DL-01-2024-1234",
            paymentDate: "2024-02-05",
            status: "PAID",
            notes: "Tiêu thụ tăng 5% so với tháng trước",
        },
        {
            id: "COST002",
            category: "WATER",
            period: "2024-01",
            amount: 500,
            unit: "m3",
            unitPrice: 15000,
            totalCost: 7500000,
            supplier: "Cấp nước TP.HCM",
            invoiceNo: "CN-01-2024-5678",
            paymentDate: "2024-02-05",
            status: "PAID",
        },
        {
            id: "COST003",
            category: "MAINTENANCE",
            period: "2024-02",
            amount: 1,
            unit: "lần",
            unitPrice: 12000000,
            totalCost: 12000000,
            supplier: "Công ty bảo trì ABC",
            invoiceNo: "BT-02-2024-0012",
            paymentDate: "2024-03-01",
            status: "PENDING",
            notes: "Sửa chữa hệ thống điều hòa",
        },
    ];

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
            VALID: { variant: "default", label: "Còn hiệu lực" },
            ACTIVE: { variant: "default", label: "Đang hoạt động" },
            EXPIRING: { variant: "secondary", label: "Sắp hết hạn" },
            EXPIRED: { variant: "destructive", label: "Đã hết hạn" },
            TERMINATED: { variant: "outline", label: "Đã chấm dứt" },
            PAID: { variant: "default", label: "Đã thanh toán" },
            PENDING: { variant: "secondary", label: "Chờ thanh toán" },
            OVERDUE: { variant: "destructive", label: "Quá hạn" },
        };
        const config = variants[status] || { variant: "outline" as const, label: status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    };

    const documentColumns = [
        { header: "Mã", accessorKey: "code" },
        { header: "Tên hồ sơ", accessorKey: "name" },
        { header: "Loại", accessorKey: "type" },
        { header: "Ngày cấp", accessorKey: "issueDate" },
        { header: "Ngày hết hạn", accessorKey: "expiryDate" },
        {
            header: "Trạng thái",
            accessorKey: "status",
            cell: ({ row }: any) => getStatusBadge(row.original.status),
        },
        { header: "Nơi lưu trữ", accessorKey: "storageLocation" },
    ];

    const contractColumns = [
        { header: "Số HĐ", accessorKey: "contractNo" },
        { header: "Tên hợp đồng", accessorKey: "title" },
        { header: "Nhà cung cấp", accessorKey: "vendor" },
        { header: "Loại", accessorKey: "type" },
        { header: "Bắt đầu", accessorKey: "startDate" },
        { header: "Kết thúc", accessorKey: "endDate" },
        {
            header: "Giá trị",
            accessorKey: "value",
            cell: ({ row }: any) => formatCurrency(row.original.value),
        },
        {
            header: "Trạng thái",
            accessorKey: "status",
            cell: ({ row }: any) => getStatusBadge(row.original.status),
        },
    ];

    const insuranceColumns = [
        { header: "Số BH", accessorKey: "policyNo" },
        { header: "Loại bảo hiểm", accessorKey: "type" },
        { header: "Nhà cung cấp", accessorKey: "provider" },
        { header: "Bắt đầu", accessorKey: "startDate" },
        { header: "Kết thúc", accessorKey: "endDate" },
        {
            header: "Phí",
            accessorKey: "premium",
            cell: ({ row }: any) => formatCurrency(row.original.premium),
        },
        {
            header: "Trạng thái",
            accessorKey: "status",
            cell: ({ row }: any) => getStatusBadge(row.original.status),
        },
    ];

    const costColumns = [
        { header: "Kỳ", accessorKey: "period" },
        { header: "Loại", accessorKey: "category" },
        { header: "Số lượng", accessorKey: "amount" },
        { header: "Đơn vị", accessorKey: "unit" },
        {
            header: "Đơn giá",
            accessorKey: "unitPrice",
            cell: ({ row }: any) => formatCurrency(row.original.unitPrice),
        },
        {
            header: "Tổng tiền",
            accessorKey: "totalCost",
            cell: ({ row }: any) => formatCurrency(row.original.totalCost),
        },
        { header: "Nhà cung cấp", accessorKey: "supplier" },
        {
            header: "Trạng thái",
            accessorKey: "status",
            cell: ({ row }: any) => getStatusBadge(row.original.status),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Quản lý hồ sơ & hợp đồng tòa nhà</h1>
                <p className="text-muted-foreground">Quản lý hồ sơ pháp lý, thiết bị, hợp đồng dịch vụ, bảo hiểm và chi phí vận hành (UC-C01-C07)</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hồ sơ pháp lý</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockDocuments.filter((d) => d.type === "LEGAL").length}</div>
                        <p className="text-xs text-muted-foreground">
                            {mockDocuments.filter((d) => d.type === "LEGAL" && d.status === "EXPIRING").length} sắp hết hạn
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hợp đồng</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockContracts.length}</div>
                        <p className="text-xs text-muted-foreground">{mockContracts.filter((c) => c.status === "ACTIVE").length} đang hoạt động</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bảo hiểm</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockInsurance.length}</div>
                        <p className="text-xs text-muted-foreground">{formatCurrency(mockInsurance.reduce((sum, i) => sum + i.premium, 0))} phí/năm</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chi phí tháng này</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(mockCosts.filter((c) => c.period === "2024-02").reduce((sum, c) => sum + c.totalCost, 0))}
                        </div>
                        <p className="text-xs text-muted-foreground">{mockCosts.filter((c) => c.status === "PENDING").length} chờ thanh toán</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hồ sơ thiết kế</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockDocuments.filter((d) => d.type === "DESIGN").length}</div>
                        <p className="text-xs text-muted-foreground">Bản vẽ & tài liệu kỹ thuật</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="legal">Hồ sơ pháp lý</TabsTrigger>
                    <TabsTrigger value="contracts">Hợp đồng dịch vụ</TabsTrigger>
                    <TabsTrigger value="insurance">Bảo hiểm</TabsTrigger>
                    <TabsTrigger value="costs">Chi phí vận hành</TabsTrigger>
                </TabsList>

                <TabsContent value="legal" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Hồ sơ pháp lý & thiết kế</CardTitle>
                                    <CardDescription>Quản lý hồ sơ, giấy phép, bản vẽ thiết kế tòa nhà</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => setIsDocDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Thêm hồ sơ
                                    </Button>
                                    <Button variant="outline" onClick={() => exportToExcel(mockDocuments, "ho-so-phap-ly")}>
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
                                        placeholder="Tìm kiếm hồ sơ..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            <DataTable columns={documentColumns} data={mockDocuments} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contracts" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Hợp đồng dịch vụ</CardTitle>
                                    <CardDescription>Quản lý hợp đồng dịch vụ, bảo trì, vận hành tòa nhà</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => setIsContractDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Thêm hợp đồng
                                    </Button>
                                    <Button variant="outline" onClick={() => exportToExcel(mockContracts, "hop-dong-dich-vu")}>
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

                <TabsContent value="insurance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Bảo hiểm</CardTitle>
                                    <CardDescription>Theo dõi các hợp đồng bảo hiểm cho tòa nhà</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => setIsInsuranceDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Thêm bảo hiểm
                                    </Button>
                                    <Button variant="outline" onClick={() => exportToExcel(mockInsurance, "bao-hiem")}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Xuất Excel
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={insuranceColumns} data={mockInsurance} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="costs" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Chi phí vận hành</CardTitle>
                                    <CardDescription>Quản lý chi phí điện, nước, bảo trì, dịch vụ hàng tháng</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => setIsCostDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Thêm chi phí
                                    </Button>
                                    <Button variant="outline" onClick={() => exportToExcel(mockCosts, "chi-phi-van-hanh")}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Xuất Excel
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={costColumns} data={mockCosts} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thêm hồ sơ mới</DialogTitle>
                        <DialogDescription>Nhập thông tin hồ sơ pháp lý hoặc thiết kế</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Loại hồ sơ</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LEGAL">Hồ sơ pháp lý</SelectItem>
                                        <SelectItem value="DESIGN">Bản vẽ thiết kế</SelectItem>
                                        <SelectItem value="EQUIPMENT">Thiết bị</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Mã hồ sơ</Label>
                                <Input placeholder="VD: XD-2024-001" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tên hồ sơ</Label>
                            <Input placeholder="VD: Giấy phép xây dựng" />
                        </div>
                        <div className="space-y-2">
                            <Label>Mô tả</Label>
                            <Textarea placeholder="Mô tả chi tiết..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ngày cấp</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>Ngày hết hạn</Label>
                                <Input type="date" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Phòng ban quản lý</Label>
                                <Input placeholder="VD: Phòng Hành chính" />
                            </div>
                            <div className="space-y-2">
                                <Label>Nơi lưu trữ</Label>
                                <Input placeholder="VD: Tủ hồ sơ A1" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDocDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={() => setIsDocDialogOpen(false)}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thêm hợp đồng mới</DialogTitle>
                        <DialogDescription>Nhập thông tin hợp đồng dịch vụ/bảo trì</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Loại hợp đồng</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SERVICE">Dịch vụ</SelectItem>
                                        <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
                                        <SelectItem value="SUPPLY">Cung cấp</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Số hợp đồng</Label>
                                <Input placeholder="VD: HĐ-DV-2024-001" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tên hợp đồng</Label>
                            <Input placeholder="VD: Hợp đồng dịch vụ vệ sinh" />
                        </div>
                        <div className="space-y-2">
                            <Label>Nhà cung cấp</Label>
                            <Input placeholder="Tên công ty" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Ngày bắt đầu</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>Ngày kết thúc</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>Giá trị (VNĐ)</Label>
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

            <Dialog open={isInsuranceDialogOpen} onOpenChange={setIsInsuranceDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thêm bảo hiểm mới</DialogTitle>
                        <DialogDescription>Nhập thông tin hợp đồng bảo hiểm</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Số hợp đồng bảo hiểm</Label>
                                <Input placeholder="VD: BH-TNDS-2024-001" />
                            </div>
                            <div className="space-y-2">
                                <Label>Nhà cung cấp</Label>
                                <Input placeholder="Công ty bảo hiểm" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Loại bảo hiểm</Label>
                                <Input placeholder="VD: Bảo hiểm cháy nổ" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phạm vi bảo hiểm</Label>
                                <Input placeholder="VD: Toàn bộ tài sản" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Ngày bắt đầu</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>Ngày kết thúc</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phí (VNĐ)</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsInsuranceDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={() => setIsInsuranceDialogOpen(false)}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isCostDialogOpen} onOpenChange={setIsCostDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thêm chi phí vận hành</DialogTitle>
                        <DialogDescription>Nhập thông tin chi phí điện, nước, bảo trì...</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Loại chi phí</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ELECTRICITY">Điện</SelectItem>
                                        <SelectItem value="WATER">Nước</SelectItem>
                                        <SelectItem value="GAS">Gas</SelectItem>
                                        <SelectItem value="SECURITY">Bảo vệ</SelectItem>
                                        <SelectItem value="CLEANING">Vệ sinh</SelectItem>
                                        <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Kỳ</Label>
                                <Input type="month" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Số lượng</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <Label>Đơn vị</Label>
                                <Input placeholder="VD: kWh, m3" />
                            </div>
                            <div className="space-y-2">
                                <Label>Đơn giá</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nhà cung cấp</Label>
                                <Input placeholder="Tên nhà cung cấp" />
                            </div>
                            <div className="space-y-2">
                                <Label>Số hóa đơn</Label>
                                <Input placeholder="Số hóa đơn" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCostDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={() => setIsCostDialogOpen(false)}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
