"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Plug,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    RefreshCw,
    Settings,
    Database,
    ShoppingCart,
    Users,
    FileText,
    Key,
    Download,
    Activity,
} from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

interface Integration {
    id: string;
    name: string;
    type: "CORE" | "PROCUREMENT" | "HR" | "BPM" | "SIGNATURE";
    status: "CONNECTED" | "DISCONNECTED" | "ERROR" | "SYNCING";
    endpoint: string;
    lastSync: string;
    totalSyncs: number;
    errors: number;
    icon: any;
}

interface SyncLog {
    id: string;
    integrationName: string;
    action: string;
    status: "SUCCESS" | "FAILED" | "PENDING";
    timestamp: string;
    records: number;
    message?: string;
}

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState<Integration[]>([
        {
            id: "int-001",
            name: "Hệ thống Core ERP",
            type: "CORE",
            status: "CONNECTED",
            endpoint: "https://core.company.vn/api/v1",
            lastSync: "2026-01-22 10:30:00",
            totalSyncs: 1247,
            errors: 3,
            icon: Database,
        },
        {
            id: "int-002",
            name: "Hệ thống Mua sắm",
            type: "PROCUREMENT",
            status: "CONNECTED",
            endpoint: "https://procurement.company.vn/api",
            lastSync: "2026-01-22 09:15:00",
            totalSyncs: 856,
            errors: 0,
            icon: ShoppingCart,
        },
        {
            id: "int-003",
            name: "Hệ thống HR",
            type: "HR",
            status: "CONNECTED",
            endpoint: "https://hr.company.vn/api/v2",
            lastSync: "2026-01-22 08:00:00",
            totalSyncs: 432,
            errors: 1,
            icon: Users,
        },
        {
            id: "int-004",
            name: "Hệ thống BPM",
            type: "BPM",
            status: "DISCONNECTED",
            endpoint: "https://bpm.company.vn/api",
            lastSync: "2026-01-21 17:00:00",
            totalSyncs: 234,
            errors: 5,
            icon: FileText,
        },
        {
            id: "int-005",
            name: "Chữ ký số HSM",
            type: "SIGNATURE",
            status: "CONNECTED",
            endpoint: "https://hsm.viettel.vn/api",
            lastSync: "2026-01-22 11:00:00",
            totalSyncs: 1523,
            errors: 0,
            icon: Key,
        },
        {
            id: "int-006",
            name: "Chữ ký số SmartCA",
            type: "SIGNATURE",
            status: "ERROR",
            endpoint: "https://smartca.vnpt.vn/api",
            lastSync: "2026-01-22 06:00:00",
            totalSyncs: 987,
            errors: 12,
            icon: Key,
        },
    ]);

    const [syncLogs, setSyncLogs] = useState<SyncLog[]>([
        {
            id: "log-001",
            integrationName: "Hệ thống Core ERP",
            action: "Đồng bộ tài sản nhập kho",
            status: "SUCCESS",
            timestamp: "2026-01-22 10:30:00",
            records: 45,
        },
        {
            id: "log-002",
            integrationName: "Hệ thống Mua sắm",
            action: "Nhận thông tin hàng hóa",
            status: "SUCCESS",
            timestamp: "2026-01-22 09:15:00",
            records: 23,
        },
        {
            id: "log-003",
            integrationName: "Hệ thống HR",
            action: "Đồng bộ danh sách nhân viên",
            status: "SUCCESS",
            timestamp: "2026-01-22 08:00:00",
            records: 156,
        },
        {
            id: "log-004",
            integrationName: "Hệ thống BPM",
            action: "Lưu trữ hồ sơ tài sản",
            status: "FAILED",
            timestamp: "2026-01-21 17:00:00",
            records: 0,
            message: "Connection timeout",
        },
        {
            id: "log-005",
            integrationName: "Chữ ký số SmartCA",
            action: "Ký số phiếu thanh lý",
            status: "FAILED",
            timestamp: "2026-01-22 06:00:00",
            records: 0,
            message: "Invalid certificate",
        },
        {
            id: "log-006",
            integrationName: "Chữ ký số HSM",
            action: "Ký số phiếu điều chuyển",
            status: "SUCCESS",
            timestamp: "2026-01-22 11:00:00",
            records: 12,
        },
    ]);

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

    const handleTestConnection = (id: string) => {
        const integration = integrations.find((i) => i.id === id);
        if (!integration) return;

        setIntegrations(integrations.map((i) => (i.id === id ? { ...i, status: "SYNCING" as const } : i)));

        setTimeout(() => {
            const success = Math.random() > 0.3;
            setIntegrations(
                integrations.map((i) =>
                    i.id === id
                        ? {
                              ...i,
                              status: success ? ("CONNECTED" as const) : ("ERROR" as const),
                              lastSync: new Date().toISOString().replace("T", " ").slice(0, 19),
                          }
                        : i
                )
            );
            alert(success ? "Kết nối thành công!" : "Kết nối thất bại!");
        }, 2000);
    };

    const handleSync = (id: string) => {
        const integration = integrations.find((i) => i.id === id);
        if (!integration) return;

        if (confirm(`Đồng bộ dữ liệu từ ${integration.name}?`)) {
            setIntegrations(integrations.map((i) => (i.id === id ? { ...i, status: "SYNCING" as const } : i)));

            setTimeout(() => {
                const newLog: SyncLog = {
                    id: `log-${Date.now()}`,
                    integrationName: integration.name,
                    action: "Đồng bộ thủ công",
                    status: "SUCCESS",
                    timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
                    records: Math.floor(Math.random() * 100) + 1,
                };

                setSyncLogs([newLog, ...syncLogs]);
                setIntegrations(
                    integrations.map((i) =>
                        i.id === id
                            ? {
                                  ...i,
                                  status: "CONNECTED" as const,
                                  lastSync: newLog.timestamp,
                                  totalSyncs: i.totalSyncs + 1,
                              }
                            : i
                    )
                );
                alert("Đồng bộ thành công!");
            }, 3000);
        }
    };

    const handleConfigure = (integration: Integration) => {
        setSelectedIntegration(integration);
        setIsConfigOpen(true);
    };

    const handleSaveConfig = () => {
        alert("Đã lưu cấu hình!");
        setIsConfigOpen(false);
    };

    const handleExportLogs = () => {
        const exportData = syncLogs.map((log) => ({
            "Hệ thống": log.integrationName,
            "Hành động": log.action,
            "Trạng thái": log.status,
            "Thời gian": log.timestamp,
            "Số bản ghi": log.records,
            "Thông báo": log.message || "",
        }));
        exportToExcel(exportData, `Integration_logs_${new Date().toISOString().slice(0, 10)}`, "Logs");
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            CONNECTED: { variant: "default" as const, icon: CheckCircle2, text: "Kết nối" },
            DISCONNECTED: { variant: "secondary" as const, icon: XCircle, text: "Ngắt kết nối" },
            ERROR: { variant: "destructive" as const, icon: AlertTriangle, text: "Lỗi" },
            SYNCING: { variant: "outline" as const, icon: RefreshCw, text: "Đang đồng bộ" },
        };
        const config = variants[status as keyof typeof variants];
        const Icon = config.icon;
        return (
            <Badge variant={config.variant} className="gap-1">
                <Icon className="h-3 w-3" />
                {config.text}
            </Badge>
        );
    };

    const connectedCount = integrations.filter((i) => i.status === "CONNECTED").length;
    const errorCount = integrations.filter((i) => i.status === "ERROR").length;
    const totalErrors = integrations.reduce((sum, i) => sum + i.errors, 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Plug className="h-6 w-6" />
                        Tích hợp hệ thống
                    </h1>
                    <p className="text-muted-foreground">Quản lý kết nối và đồng bộ dữ liệu với các hệ thống bên ngoài</p>
                </div>
                <Button variant="outline" onClick={handleExportLogs}>
                    <Download className="mr-2 h-4 w-4" />
                    Xuất log
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Tổng hệ thống</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{integrations.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Đang kết nối</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Có lỗi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Tổng lỗi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{totalErrors}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="integrations" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="integrations">Danh sách tích hợp</TabsTrigger>
                    <TabsTrigger value="logs">Lịch sử đồng bộ</TabsTrigger>
                </TabsList>

                <TabsContent value="integrations" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {integrations.map((integration) => {
                            const Icon = integration.icon;
                            return (
                                <Card key={integration.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Icon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base">{integration.name}</CardTitle>
                                                    <CardDescription className="text-xs mt-1">{integration.endpoint}</CardDescription>
                                                </div>
                                            </div>
                                            {getStatusBadge(integration.status)}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <div>
                                                <div className="text-muted-foreground text-xs">Đồng bộ</div>
                                                <div className="font-medium">{integration.totalSyncs}</div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground text-xs">Lỗi</div>
                                                <div className="font-medium text-red-600">{integration.errors}</div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground text-xs">Lần cuối</div>
                                                <div className="font-medium text-xs">{integration.lastSync.slice(11, 16)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleTestConnection(integration.id)}
                                                disabled={integration.status === "SYNCING"}
                                            >
                                                <Activity className="mr-1 h-3 w-3" />
                                                Test
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleSync(integration.id)}
                                                disabled={integration.status !== "CONNECTED"}
                                            >
                                                <RefreshCw className="mr-1 h-3 w-3" />
                                                Đồng bộ
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleConfigure(integration)}>
                                                <Settings className="mr-1 h-3 w-3" />
                                                Cấu hình
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="logs" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lịch sử đồng bộ dữ liệu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Thời gian</TableHead>
                                        <TableHead>Hệ thống</TableHead>
                                        <TableHead>Hành động</TableHead>
                                        <TableHead>Số bản ghi</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>Thông báo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {syncLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                                            <TableCell className="font-medium">{log.integrationName}</TableCell>
                                            <TableCell>{log.action}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{log.records}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {log.status === "SUCCESS" ? (
                                                    <Badge variant="default" className="gap-1">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Thành công
                                                    </Badge>
                                                ) : log.status === "FAILED" ? (
                                                    <Badge variant="destructive" className="gap-1">
                                                        <XCircle className="h-3 w-3" />
                                                        Thất bại
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="gap-1">
                                                        <RefreshCw className="h-3 w-3" />
                                                        Đang xử lý
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{log.message || "-"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Cấu hình tích hợp - {selectedIntegration?.name}</DialogTitle>
                        <DialogDescription>Thiết lập thông tin kết nối và đồng bộ dữ liệu</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>API Endpoint</Label>
                            <Input defaultValue={selectedIntegration?.endpoint} placeholder="https://api.example.com/v1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>API Key</Label>
                                <Input type="password" placeholder="••••••••••••••••" />
                            </div>
                            <div className="space-y-2">
                                <Label>API Secret</Label>
                                <Input type="password" placeholder="••••••••••••••••" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tần suất đồng bộ (phút)</Label>
                            <Input type="number" defaultValue="15" min="5" max="1440" />
                        </div>
                        <div className="space-y-2">
                            <Label>Cấu hình nâng cao (JSON)</Label>
                            <Textarea
                                rows={6}
                                defaultValue={JSON.stringify(
                                    {
                                        timeout: 30000,
                                        retry: 3,
                                        batchSize: 100,
                                    },
                                    null,
                                    2
                                )}
                                className="font-mono text-xs"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSaveConfig}>Lưu cấu hình</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
