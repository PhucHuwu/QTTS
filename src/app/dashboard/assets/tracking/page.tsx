"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Activity, TrendingUp, AlertTriangle, Clock, MapPin, User, Calendar, Download, Search, Filter } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

interface AssetMovement {
    id: string;
    assetId: string;
    assetCode: string;
    assetName: string;
    action: "TRANSFER" | "LOAN" | "MAINTENANCE" | "RETURN" | "WAREHOUSE_MOVE" | "EXPORT" | "IMPORT";
    fromLocation: string;
    toLocation: string;
    fromManager: string;
    toManager: string;
    timestamp: string;
    status: "PENDING" | "APPROVED" | "COMPLETED" | "REJECTED";
    note: string;
}

interface AssetAlert {
    id: string;
    assetId: string;
    assetCode: string;
    assetName: string;
    type: "OVERDUE" | "WARRANTY_EXPIRING" | "DEPRECIATION_DUE" | "MAINTENANCE_DUE" | "MISSING";
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    message: string;
    dueDate: string;
    createdAt: string;
}

export default function AssetTrackingPage() {
    const assets = useAppStore((state) => state.assets);
    const [activeTab, setActiveTab] = useState("movements");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");

    // Mock asset movements data
    const [movements] = useState<AssetMovement[]>([
        {
            id: "mov-1",
            assetId: "asset-1",
            assetCode: "TS-001",
            assetName: "Laptop Dell XPS 15",
            action: "TRANSFER",
            fromLocation: "Phòng IT - Tầng 3",
            toLocation: "Phòng Kế toán - Tầng 2",
            fromManager: "Nguyễn Văn A",
            toManager: "Trần Thị B",
            timestamp: "2024-01-15 10:30:00",
            status: "COMPLETED",
            note: "Điều chuyển theo yêu cầu",
        },
        {
            id: "mov-2",
            assetId: "asset-2",
            assetCode: "TS-002",
            assetName: 'Màn hình Samsung 27"',
            action: "MAINTENANCE",
            fromLocation: "Phòng IT - Tầng 3",
            toLocation: "Bảo trì - Tầng 1",
            fromManager: "Nguyễn Văn A",
            toManager: "Lê Văn C",
            timestamp: "2024-01-14 14:20:00",
            status: "PENDING",
            note: "Bảo trì định kỳ",
        },
        {
            id: "mov-3",
            assetId: "asset-3",
            assetCode: "TS-003",
            assetName: "Máy in HP LaserJet",
            action: "LOAN",
            fromLocation: "Kho tầng 1",
            toLocation: "Phòng Hành chính - Tầng 2",
            fromManager: "Kho",
            toManager: "Phạm Thị D",
            timestamp: "2024-01-13 09:15:00",
            status: "APPROVED",
            note: "Cho mượn tạm thời",
        },
    ]);

    // Mock alerts data
    const [alerts] = useState<AssetAlert[]>([
        {
            id: "alert-1",
            assetId: "asset-1",
            assetCode: "TS-001",
            assetName: "Laptop Dell XPS 15",
            type: "WARRANTY_EXPIRING",
            severity: "MEDIUM",
            message: "Bảo hành sắp hết hạn",
            dueDate: "2024-02-15",
            createdAt: "2024-01-10",
        },
        {
            id: "alert-2",
            assetId: "asset-2",
            assetCode: "TS-002",
            assetName: 'Màn hình Samsung 27"',
            type: "MAINTENANCE_DUE",
            severity: "HIGH",
            message: "Đến hạn bảo trì định kỳ",
            dueDate: "2024-01-20",
            createdAt: "2024-01-15",
        },
        {
            id: "alert-3",
            assetId: "asset-5",
            assetCode: "TS-005",
            assetName: "Máy chiếu Epson",
            type: "MISSING",
            severity: "CRITICAL",
            message: "Tài sản không tìm thấy trong kiểm kê",
            dueDate: "2024-01-15",
            createdAt: "2024-01-15",
        },
    ]);

    const filterByDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();

        switch (dateFilter) {
            case "today":
                return date.toDateString() === now.toDateString();
            case "week":
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return date >= weekAgo;
            case "month":
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return date >= monthAgo;
            default:
                return true;
        }
    };

    const filteredMovements = movements.filter((mov) => {
        const matchesSearch = mov.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) || mov.assetName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = filterByDate(mov.timestamp);

        return matchesSearch && matchesDate;
    });

    const filteredAlerts = alerts.filter(
        (alert) => alert.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) || alert.assetName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getActionBadge = (action: string) => {
        const variants: Record<string, any> = {
            TRANSFER: { variant: "default", label: "Điều chuyển" },
            LOAN: { variant: "secondary", label: "Cho mượn" },
            MAINTENANCE: { variant: "outline", label: "Bảo trì" },
            RETURN: { variant: "default", label: "Trả lại" },
            WAREHOUSE_MOVE: { variant: "secondary", label: "Chuyển kho" },
            EXPORT: { variant: "destructive", label: "Xuất kho" },
            IMPORT: { variant: "default", label: "Nhập kho" },
        };

        const config = variants[action] || variants.TRANSFER;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            PENDING: { variant: "outline", label: "Chờ xử lý" },
            APPROVED: { variant: "secondary", label: "Đã phê duyệt" },
            COMPLETED: { variant: "default", label: "Hoàn thành" },
            REJECTED: { variant: "destructive", label: "Từ chối" },
        };

        const config = variants[status] || variants.PENDING;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const getSeverityBadge = (severity: string) => {
        const variants: Record<string, any> = {
            LOW: { variant: "outline", label: "Thấp", color: "text-green-600" },
            MEDIUM: { variant: "secondary", label: "Trung bình", color: "text-yellow-600" },
            HIGH: { variant: "destructive", label: "Cao", color: "text-orange-600" },
            CRITICAL: { variant: "destructive", label: "Nghiêm trọng", color: "text-red-600" },
        };

        const config = variants[severity] || variants.LOW;
        return (
            <Badge variant={config.variant} className={config.color}>
                {config.label}
            </Badge>
        );
    };

    const getAlertIcon = (type: string) => {
        const icons: Record<string, any> = {
            OVERDUE: Clock,
            WARRANTY_EXPIRING: Calendar,
            DEPRECIATION_DUE: TrendingUp,
            MAINTENANCE_DUE: Activity,
            MISSING: AlertTriangle,
        };

        const Icon = icons[type] || AlertTriangle;
        return <Icon className="h-4 w-4" />;
    };

    const handleExportMovements = () => {
        const exportData = filteredMovements.map((mov) => ({
            "Mã TS": mov.assetCode,
            "Tên tài sản": mov.assetName,
            "Hành động": mov.action,
            "Từ vị trí": mov.fromLocation,
            "Đến vị trí": mov.toLocation,
            "Từ người": mov.fromManager,
            "Đến người": mov.toManager,
            "Thời gian": mov.timestamp,
            "Trạng thái": mov.status,
            "Ghi chú": mov.note,
        }));

        exportToExcel(exportData, "Lich_su_di_chuyen_TS", "Di chuyển");
    };

    const handleExportAlerts = () => {
        const exportData = filteredAlerts.map((alert) => ({
            "Mã TS": alert.assetCode,
            "Tên tài sản": alert.assetName,
            "Loại cảnh báo": alert.type,
            "Mức độ": alert.severity,
            "Thông báo": alert.message,
            "Hạn xử lý": alert.dueDate,
            "Ngày tạo": alert.createdAt,
        }));

        exportToExcel(exportData, "Canh_bao_TS", "Cảnh báo");
    };

    const stats = {
        totalMovements: movements.length,
        pendingMovements: movements.filter((m) => m.status === "PENDING").length,
        completedMovements: movements.filter((m) => m.status === "COMPLETED").length,
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter((a) => a.severity === "CRITICAL").length,
        highAlerts: alerts.filter((a) => a.severity === "HIGH").length,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="h-6 w-6" />
                        Theo dõi & Giám sát Tài sản
                    </h1>
                    <p className="text-sm text-muted-foreground">Theo dõi di chuyển và nhận cảnh báo về tài sản</p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tổng di chuyển</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalMovements}</div>
                        <p className="text-xs text-muted-foreground">{stats.pendingMovements} chờ xử lý</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.completedMovements}</div>
                        <p className="text-xs text-muted-foreground">Di chuyển thành công</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tổng cảnh báo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.totalAlerts}</div>
                        <p className="text-xs text-muted-foreground">{stats.criticalAlerts} nghiêm trọng</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Cảnh báo cao</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.highAlerts}</div>
                        <p className="text-xs text-muted-foreground">Cần xử lý gấp</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <Label>Tìm kiếm</Label>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Mã TS, tên tài sản..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Khoảng thời gian</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value as any)}
                            >
                                <option value="all">Tất cả</option>
                                <option value="today">Hôm nay</option>
                                <option value="week">7 ngày qua</option>
                                <option value="month">30 ngày qua</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="movements">Di chuyển tài sản ({filteredMovements.length})</TabsTrigger>
                    <TabsTrigger value="alerts">Cảnh báo ({filteredAlerts.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="movements" className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={handleExportMovements}>
                            <Download className="mr-2 h-4 w-4" />
                            Xuất báo cáo
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã TS</TableHead>
                                        <TableHead>Tên tài sản</TableHead>
                                        <TableHead>Hành động</TableHead>
                                        <TableHead>Di chuyển</TableHead>
                                        <TableHead>Người quản lý</TableHead>
                                        <TableHead>Thời gian</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>Ghi chú</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMovements.map((mov) => (
                                        <TableRow key={mov.id}>
                                            <TableCell className="font-medium">{mov.assetCode}</TableCell>
                                            <TableCell>{mov.assetName}</TableCell>
                                            <TableCell>{getActionBadge(mov.action)}</TableCell>
                                            <TableCell>
                                                <div className="space-y-1 text-xs">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Từ:</span>
                                                        <span>{mov.fromLocation}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3 text-green-600" />
                                                        <span className="text-muted-foreground">Đến:</span>
                                                        <span className="font-medium">{mov.toLocation}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1 text-xs">
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3 text-muted-foreground" />
                                                        <span>{mov.fromManager}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3 text-green-600" />
                                                        <span className="font-medium">{mov.toManager}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-xs">{mov.timestamp}</div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(mov.status)}</TableCell>
                                            <TableCell>
                                                <div className="text-xs text-muted-foreground max-w-xs truncate">{mov.note || "-"}</div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="alerts" className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={handleExportAlerts}>
                            <Download className="mr-2 h-4 w-4" />
                            Xuất báo cáo
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mức độ</TableHead>
                                        <TableHead>Mã TS</TableHead>
                                        <TableHead>Tên tài sản</TableHead>
                                        <TableHead>Loại cảnh báo</TableHead>
                                        <TableHead>Thông báo</TableHead>
                                        <TableHead>Hạn xử lý</TableHead>
                                        <TableHead>Ngày tạo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAlerts.map((alert) => (
                                        <TableRow key={alert.id}>
                                            <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                                            <TableCell className="font-medium">{alert.assetCode}</TableCell>
                                            <TableCell>{alert.assetName}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getAlertIcon(alert.type)}
                                                    <span className="text-xs">{alert.type}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{alert.message}</TableCell>
                                            <TableCell>
                                                <div className="text-xs font-medium">{alert.dueDate}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-xs text-muted-foreground">{alert.createdAt}</div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
