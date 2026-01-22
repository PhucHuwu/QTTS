"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportToExcel, formatLogsForExport } from "@/lib/exportUtils";

export default function SystemLogsPage() {
    const systemLogs = useAppStore((state) => state.systemLogs);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        action: "",
        severity: "",
        startDate: "",
        endDate: "",
    });

    const filteredLogs = systemLogs.filter((log) => {
        const matchesAction = !filters.action || log.action.includes(filters.action);
        const matchesSeverity = !filters.severity || log.severity === filters.severity;
        const logDate = new Date(log.timestamp);
        const matchesStartDate = !filters.startDate || logDate >= new Date(filters.startDate);
        const matchesEndDate = !filters.endDate || logDate <= new Date(filters.endDate);
        return matchesAction && matchesSeverity && matchesStartDate && matchesEndDate;
    });

    const handleExportExcel = () => {
        const formattedData = formatLogsForExport(filteredLogs);
        exportToExcel(formattedData, `Nhat_ky_he_thong_${new Date().toISOString().slice(0, 10)}`, "Nhật ký");
    };

    const handleApplyFilters = () => {
        setIsFilterOpen(false);
    };

    const handleResetFilters = () => {
        setFilters({
            action: "",
            severity: "",
            startDate: "",
            endDate: "",
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Nhật ký hệ thống</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportExcel}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="mr-2 h-4 w-4" />
                        Bộ lọc
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Thời gian</TableHead>
                            <TableHead>Hành động</TableHead>
                            <TableHead>Người dùng</TableHead>
                            <TableHead>Chi tiết</TableHead>
                            <TableHead>Mức độ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLogs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Không có nhật ký nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{new Date(log.timestamp).toLocaleString("vi-VN")}</TableCell>
                                    <TableCell className="font-medium">{log.action}</TableCell>
                                    <TableCell>{log.userName}</TableCell>
                                    <TableCell className="max-w-md truncate">{log.details}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={log.severity === "ERROR" ? "destructive" : log.severity === "WARNING" ? "secondary" : "default"}
                                            className={log.severity === "INFO" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""}
                                        >
                                            {log.severity}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="text-xs text-muted-foreground">
                Hiển thị {filteredLogs.length} trên tổng số {systemLogs.length} bản ghi.
            </div>

            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Bộ lọc nhật ký</DialogTitle>
                        <DialogDescription>Chọn các tiêu chí để lọc nhật ký hệ thống.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Loại hành động</Label>
                            <Input
                                placeholder="VD: LOGIN, CREATE_ASSET..."
                                value={filters.action}
                                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Mức độ</Label>
                            <Select value={filters.severity} onValueChange={(value) => setFilters({ ...filters, severity: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tất cả" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Tất cả</SelectItem>
                                    <SelectItem value="INFO">INFO</SelectItem>
                                    <SelectItem value="WARNING">WARNING</SelectItem>
                                    <SelectItem value="ERROR">ERROR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Khoảng thời gian</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
                                <Input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleResetFilters}>
                            Đặt lại
                        </Button>
                        <Button onClick={handleApplyFilters}>Áp dụng</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
