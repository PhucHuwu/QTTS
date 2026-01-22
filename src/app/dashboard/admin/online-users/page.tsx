"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserX, Activity } from "lucide-react";

export default function OnlineUsersPage() {
    const users = useAppStore((state) => state.users);

    // Mock online users data
    const [onlineUsers, setOnlineUsers] = useState([
        {
            userId: users[0]?.id,
            loginTime: "2026-01-22 09:15:30",
            lastActivity: "2026-01-22 15:14:20",
            ipAddress: "192.168.1.100",
            sessionId: "sess-001",
        },
        {
            userId: users[1]?.id,
            loginTime: "2026-01-22 10:30:15",
            lastActivity: "2026-01-22 15:13:50",
            ipAddress: "192.168.1.105",
            sessionId: "sess-002",
        },
        {
            userId: users[2]?.id,
            loginTime: "2026-01-22 13:45:00",
            lastActivity: "2026-01-22 15:12:10",
            ipAddress: "192.168.1.110",
            sessionId: "sess-003",
        },
    ]);

    const handleKickUser = (sessionId: string) => {
        if (confirm("Xác nhận ngắt kết nối người dùng này?")) {
            setOnlineUsers(onlineUsers.filter((u) => u.sessionId !== sessionId));
            alert("Đã ngắt kết nối người dùng!");
        }
    };

    const getActivityStatus = (lastActivity: string) => {
        const now = new Date();
        const last = new Date(lastActivity);
        const diffMinutes = Math.floor((now.getTime() - last.getTime()) / 1000 / 60);

        if (diffMinutes < 5) return { label: "Đang hoạt động", variant: "default" as const };
        if (diffMinutes < 15) return { label: "Idle", variant: "secondary" as const };
        return { label: "Không hoạt động", variant: "destructive" as const };
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        Quản lý người dùng Online
                    </h1>
                    <p className="text-muted-foreground">Theo dõi và quản lý phiên đăng nhập</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-lg py-2 px-4">
                        <Activity className="mr-2 h-4 w-4" />
                        {onlineUsers.length} đang online
                    </Badge>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách người dùng đang online</CardTitle>
                    <CardDescription>Quản lý phiên làm việc và ngắt kết nối nếu cần</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Người dùng</TableHead>
                                <TableHead>Vai trò</TableHead>
                                <TableHead>Thời gian đăng nhập</TableHead>
                                <TableHead>Hoạt động cuối</TableHead>
                                <TableHead>IP Address</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {onlineUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        Không có người dùng nào đang online
                                    </TableCell>
                                </TableRow>
                            ) : (
                                onlineUsers.map((session) => {
                                    const user = users.find((u) => u.id === session.userId);
                                    const status = getActivityStatus(session.lastActivity);

                                    return (
                                        <TableRow key={session.sessionId}>
                                            <TableCell className="font-medium">{user?.name || "Unknown"}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{user?.role || "User"}</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">{session.loginTime}</TableCell>
                                            <TableCell className="text-sm">{session.lastActivity}</TableCell>
                                            <TableCell className="font-mono text-sm">{session.ipAddress}</TableCell>
                                            <TableCell>
                                                <Badge variant={status.variant}>{status.label}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button size="sm" variant="destructive" onClick={() => handleKickUser(session.sessionId)}>
                                                    <UserX className="mr-2 h-4 w-4" />
                                                    Kick
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Tổng online</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{onlineUsers.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Đang hoạt động</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {onlineUsers.filter((u) => getActivityStatus(u.lastActivity).variant === "default").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Idle/Không hoạt động</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {onlineUsers.filter((u) => getActivityStatus(u.lastActivity).variant !== "default").length}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
