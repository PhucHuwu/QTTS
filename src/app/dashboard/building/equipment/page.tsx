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
import { Wrench, Plus, Search, Download, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { exportToExcel } from "@/lib/exportUtils";

interface Equipment {
    id: string;
    code: string;
    name: string;
    category: "ELEVATOR" | "AC" | "FIRE" | "ELECTRICAL" | "PLUMBING" | "GENERATOR" | "OTHER";
    location: string;
    installDate: string;
    manufacturer: string;
    warrantyExpiry?: string;
    status: "OPERATING" | "MAINTENANCE" | "BROKEN" | "RETIRED";
    lastMaintenance?: string;
    nextMaintenance?: string;
    notes?: string;
}

interface MaintenanceSchedule {
    id: string;
    equipmentId: string;
    equipmentName: string;
    type: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
    description: string;
    assignedTo: string;
    scheduledDate: string;
    completedDate?: string;
    status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
    notes?: string;
}

interface MaintenanceHistory {
    id: string;
    equipmentId: string;
    equipmentName: string;
    date: string;
    type: "PREVENTIVE" | "CORRECTIVE" | "INSPECTION";
    description: string;
    technician: string;
    cost: number;
    duration: number;
    parts?: string;
    result: string;
    nextSchedule?: string;
}

export default function BuildingEquipmentPage() {
    const [activeTab, setActiveTab] = useState("equipment");
    const [searchTerm, setSearchTerm] = useState("");
    const [isEquipmentDialogOpen, setIsEquipmentDialogOpen] = useState(false);
    const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

    // Mock data
    const mockEquipment: Equipment[] = [
        {
            id: "EQ001",
            code: "TM-001",
            name: "Thang máy số 1",
            category: "ELEVATOR",
            location: "Khu A - Tầng 1-10",
            installDate: "2020-06-15",
            manufacturer: "Mitsubishi",
            warrantyExpiry: "2025-06-15",
            status: "OPERATING",
            lastMaintenance: "2024-02-01",
            nextMaintenance: "2024-04-01",
            notes: "Bảo trì định kỳ 2 tháng/lần",
        },
        {
            id: "EQ002",
            code: "DH-001",
            name: "Điều hòa trung tâm - Tầng 5",
            category: "AC",
            location: "Tầng 5",
            installDate: "2021-03-20",
            manufacturer: "Daikin",
            warrantyExpiry: "2024-03-20",
            status: "MAINTENANCE",
            lastMaintenance: "2024-02-15",
            nextMaintenance: "2024-03-15",
            notes: "Đang bảo trì định kỳ",
        },
        {
            id: "EQ003",
            code: "PCCC-001",
            name: "Hệ thống chữa cháy tự động",
            category: "FIRE",
            location: "Toàn tòa nhà",
            installDate: "2020-01-10",
            manufacturer: "FirePro",
            warrantyExpiry: "2025-01-10",
            status: "OPERATING",
            lastMaintenance: "2024-01-10",
            nextMaintenance: "2025-01-10",
            notes: "Kiểm tra hàng năm theo quy định PCCC",
        },
        {
            id: "EQ004",
            code: "DL-001",
            name: "Máy phát điện dự phòng",
            category: "GENERATOR",
            location: "Tầng hầm B1",
            installDate: "2020-05-01",
            manufacturer: "Cummins",
            status: "OPERATING",
            lastMaintenance: "2024-02-20",
            nextMaintenance: "2024-05-20",
            notes: "Chạy thử định kỳ mỗi tháng",
        },
    ];

    const mockSchedule: MaintenanceSchedule[] = [
        {
            id: "SCH001",
            equipmentId: "EQ001",
            equipmentName: "Thang máy số 1",
            type: "MONTHLY",
            description: "Kiểm tra và bôi trơn hệ thống dây cáp",
            assignedTo: "Nguyễn Văn A",
            scheduledDate: "2024-03-01",
            status: "SCHEDULED",
        },
        {
            id: "SCH002",
            equipmentId: "EQ002",
            equipmentName: "Điều hòa trung tâm - Tầng 5",
            type: "MONTHLY",
            description: "Vệ sinh lưới lọc và kiểm tra gas",
            assignedTo: "Trần Văn B",
            scheduledDate: "2024-02-25",
            status: "OVERDUE",
        },
        {
            id: "SCH003",
            equipmentId: "EQ004",
            equipmentName: "Máy phát điện dự phòng",
            type: "WEEKLY",
            description: "Chạy thử máy phát điện",
            assignedTo: "Lê Văn C",
            scheduledDate: "2024-02-28",
            completedDate: "2024-02-28",
            status: "COMPLETED",
        },
    ];

    const mockHistory: MaintenanceHistory[] = [
        {
            id: "HIST001",
            equipmentId: "EQ001",
            equipmentName: "Thang máy số 1",
            date: "2024-02-01",
            type: "PREVENTIVE",
            description: "Bảo trì định kỳ tháng 2",
            technician: "Nguyễn Văn A",
            cost: 5000000,
            duration: 4,
            parts: "Dầu bôi trơn, vít ốc",
            result: "Hoàn thành tốt, không có vấn đề",
            nextSchedule: "2024-04-01",
        },
        {
            id: "HIST002",
            equipmentId: "EQ002",
            equipmentName: "Điều hòa trung tâm - Tầng 5",
            date: "2024-02-15",
            type: "CORRECTIVE",
            description: "Sửa chữa rò rỉ gas",
            technician: "Trần Văn B",
            cost: 8000000,
            duration: 6,
            parts: "Gas R410A, đồng hồ áp suất",
            result: "Đã khắc phục rò rỉ, nạp lại gas",
            nextSchedule: "2024-03-15",
        },
        {
            id: "HIST003",
            equipmentId: "EQ003",
            equipmentName: "Hệ thống chữa cháy tự động",
            date: "2024-01-10",
            type: "INSPECTION",
            description: "Kiểm tra định kỳ hàng năm",
            technician: "Lê Văn C",
            cost: 12000000,
            duration: 8,
            result: "Hệ thống hoạt động tốt, đạt chuẩn PCCC",
            nextSchedule: "2025-01-10",
        },
    ];

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; icon?: any }> = {
            OPERATING: { variant: "default", label: "Hoạt động", icon: CheckCircle },
            MAINTENANCE: { variant: "secondary", label: "Bảo trì", icon: Wrench },
            BROKEN: { variant: "destructive", label: "Hỏng", icon: AlertTriangle },
            RETIRED: { variant: "outline", label: "Ngừng sử dụng" },
            SCHEDULED: { variant: "default", label: "Đã lên lịch", icon: Calendar },
            IN_PROGRESS: { variant: "secondary", label: "Đang thực hiện", icon: Clock },
            COMPLETED: { variant: "default", label: "Hoàn thành", icon: CheckCircle },
            OVERDUE: { variant: "destructive", label: "Quá hạn", icon: AlertTriangle },
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

    const equipmentColumns = [
        { header: "Mã TB", accessorKey: "code" },
        { header: "Tên thiết bị", accessorKey: "name" },
        { header: "Loại", accessorKey: "category" },
        { header: "Vị trí", accessorKey: "location" },
        { header: "Nhà sản xuất", accessorKey: "manufacturer" },
        { header: "BT cuối", accessorKey: "lastMaintenance" },
        { header: "BT tiếp", accessorKey: "nextMaintenance" },
        {
            header: "Trạng thái",
            accessorKey: "status",
            cell: ({ row }: any) => getStatusBadge(row.original.status),
        },
    ];

    const scheduleColumns = [
        { header: "Thiết bị", accessorKey: "equipmentName" },
        { header: "Loại", accessorKey: "type" },
        { header: "Mô tả", accessorKey: "description" },
        { header: "Người thực hiện", accessorKey: "assignedTo" },
        { header: "Ngày lên lịch", accessorKey: "scheduledDate" },
        { header: "Ngày hoàn thành", accessorKey: "completedDate" },
        {
            header: "Trạng thái",
            accessorKey: "status",
            cell: ({ row }: any) => getStatusBadge(row.original.status),
        },
    ];

    const historyColumns = [
        { header: "Ngày", accessorKey: "date" },
        { header: "Thiết bị", accessorKey: "equipmentName" },
        { header: "Loại", accessorKey: "type" },
        { header: "Mô tả", accessorKey: "description" },
        { header: "Kỹ thuật viên", accessorKey: "technician" },
        {
            header: "Chi phí",
            accessorKey: "cost",
            cell: ({ row }: any) => formatCurrency(row.original.cost),
        },
        {
            header: "Thời gian (giờ)",
            accessorKey: "duration",
        },
    ];

    const totalEquipment = mockEquipment.length;
    const operatingCount = mockEquipment.filter((e) => e.status === "OPERATING").length;
    const maintenanceCount = mockEquipment.filter((e) => e.status === "MAINTENANCE").length;
    const brokenCount = mockEquipment.filter((e) => e.status === "BROKEN").length;
    const overdueCount = mockSchedule.filter((s) => s.status === "OVERDUE").length;
    const totalMaintenanceCost = mockHistory.reduce((sum, h) => sum + h.cost, 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Quản lý thiết bị & bảo trì</h1>
                <p className="text-muted-foreground">Quản lý thiết bị tòa nhà và lập lịch bảo trì định kỳ</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng thiết bị</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEquipment}</div>
                        <p className="text-xs text-muted-foreground">Đang quản lý</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hoạt động</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{operatingCount}</div>
                        <p className="text-xs text-muted-foreground">{Math.round((operatingCount / totalEquipment) * 100)}% tổng số</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang bảo trì</CardTitle>
                        <Wrench className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{maintenanceCount}</div>
                        <p className="text-xs text-muted-foreground">Tạm ngừng</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hỏng hóc</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{brokenCount}</div>
                        <p className="text-xs text-muted-foreground">Cần sửa chữa</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quá hạn BT</CardTitle>
                        <Clock className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overdueCount}</div>
                        <p className="text-xs text-muted-foreground">Cần xử lý gấp</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chi phí BT</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalMaintenanceCost).replace("₫", "tr")}</div>
                        <p className="text-xs text-muted-foreground">Tổng chi phí</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="equipment">Danh sách thiết bị</TabsTrigger>
                    <TabsTrigger value="schedule">Lịch bảo trì</TabsTrigger>
                    <TabsTrigger value="history">Lịch sử bảo trì</TabsTrigger>
                </TabsList>

                <TabsContent value="equipment" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Thiết bị tòa nhà</CardTitle>
                                    <CardDescription>Quản lý thông tin thiết bị và trạng thái hoạt động</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => setIsEquipmentDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Thêm thiết bị
                                    </Button>
                                    <Button variant="outline" onClick={() => exportToExcel(mockEquipment, "thiet-bi-toa-nha")}>
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
                                        placeholder="Tìm kiếm thiết bị..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            <DataTable columns={equipmentColumns} data={mockEquipment} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Lịch bảo trì</CardTitle>
                                    <CardDescription>Lập lịch và theo dõi tiến độ bảo trì định kỳ</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => setIsScheduleDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Thêm lịch
                                    </Button>
                                    <Button variant="outline" onClick={() => exportToExcel(mockSchedule, "lich-bao-tri")}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Xuất Excel
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={scheduleColumns} data={mockSchedule} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Lịch sử bảo trì</CardTitle>
                                    <CardDescription>Theo dõi các hoạt động bảo trì đã thực hiện</CardDescription>
                                </div>
                                <Button variant="outline" onClick={() => exportToExcel(mockHistory, "lich-su-bao-tri")}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Xuất Excel
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={historyColumns} data={mockHistory} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Equipment Dialog */}
            <Dialog open={isEquipmentDialogOpen} onOpenChange={setIsEquipmentDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thêm thiết bị mới</DialogTitle>
                        <DialogDescription>Nhập thông tin thiết bị tòa nhà</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Mã thiết bị</Label>
                                <Input placeholder="VD: TM-001" />
                            </div>
                            <div className="space-y-2">
                                <Label>Loại thiết bị</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ELEVATOR">Thang máy</SelectItem>
                                        <SelectItem value="AC">Điều hòa</SelectItem>
                                        <SelectItem value="FIRE">PCCC</SelectItem>
                                        <SelectItem value="ELECTRICAL">Điện</SelectItem>
                                        <SelectItem value="PLUMBING">Nước</SelectItem>
                                        <SelectItem value="GENERATOR">Máy phát điện</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tên thiết bị</Label>
                            <Input placeholder="VD: Thang máy số 1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Vị trí</Label>
                                <Input placeholder="VD: Tầng 1-10" />
                            </div>
                            <div className="space-y-2">
                                <Label>Nhà sản xuất</Label>
                                <Input placeholder="VD: Mitsubishi" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ngày lắp đặt</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>Hết hạn bảo hành</Label>
                                <Input type="date" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Ghi chú</Label>
                            <Textarea placeholder="Ghi chú về thiết bị..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEquipmentDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={() => setIsEquipmentDialogOpen(false)}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Schedule Dialog */}
            <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Lập lịch bảo trì</DialogTitle>
                        <DialogDescription>Tạo lịch bảo trì cho thiết bị</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Thiết bị</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn thiết bị" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockEquipment.map((eq) => (
                                        <SelectItem key={eq.id} value={eq.id}>
                                            {eq.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Loại bảo trì</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DAILY">Hàng ngày</SelectItem>
                                        <SelectItem value="WEEKLY">Hàng tuần</SelectItem>
                                        <SelectItem value="MONTHLY">Hàng tháng</SelectItem>
                                        <SelectItem value="QUARTERLY">Hàng quý</SelectItem>
                                        <SelectItem value="YEARLY">Hàng năm</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Ngày thực hiện</Label>
                                <Input type="date" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Mô tả công việc</Label>
                            <Textarea placeholder="Mô tả chi tiết công việc bảo trì..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Người thực hiện</Label>
                            <Input placeholder="Tên kỹ thuật viên" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={() => setIsScheduleDialogOpen(false)}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
