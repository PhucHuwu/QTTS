"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LOGS = [
    { id: 1, action: "LOGIN", user: "admin@qtts.com", time: "2025-01-22 08:30:12", status: "SUCCESS", detail: "Đăng nhập thành công IP: 192.168.1.1" },
    { id: 2, action: "Asset_CREATE", user: "admin@qtts.com", time: "2025-01-22 09:15:00", status: "SUCCESS", detail: "Tạo tài sản mới TS0004" },
    { id: 3, action: "LOGIN", user: "manager@qtts.com", time: "2025-01-22 09:45:33", status: "FAILED", detail: "Sai mật khẩu" },
    { id: 4, action: "Category_UPDATE", user: "admin@qtts.com", time: "2025-01-22 10:20:11", status: "SUCCESS", detail: "Cập nhật loại tài sản LT" },
    { id: 5, action: "Asset_UPDATE", user: "user@qtts.com", time: "2025-01-22 11:00:00", status: "SUCCESS", detail: "Báo hỏng tài sản TS0001" },
];

export default function SystemLogsPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">Nhật ký hệ thống</h1>

            <div className="flex gap-4">
                <Input placeholder="Tìm kiếm theo user, hành động..." className="max-w-sm" />
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Loại hành động" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="login">Đăng nhập</SelectItem>
                        <SelectItem value="data">Dữ liệu</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Thời gian</TableHead>
                            <TableHead>Người dùng</TableHead>
                            <TableHead>Hành động</TableHead>
                            <TableHead>Chi tiết</TableHead>
                            <TableHead>Trạng thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {LOGS.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="font-mono text-xs">{log.time}</TableCell>
                                <TableCell>{log.user}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{log.action}</Badge>
                                </TableCell>
                                <TableCell>{log.detail}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={log.status === "SUCCESS" ? "default" : "destructive"}
                                        className={log.status === "SUCCESS" ? "bg-green-600 hover:bg-green-600" : ""}
                                    >
                                        {log.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
