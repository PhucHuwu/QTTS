"use client";

import { useEffect, useState } from "react";
import { AppState, useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
    const currentUser = useAppStore((state: AppState) => state.currentUser);
    const updateUser = useAppStore((state: AppState) => state.updateUser);

    // Local state for form
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name);
            setEmail(currentUser.email);
            setAvatar(currentUser.avatar || "");
            setRole(currentUser.role);
        }
    }, [currentUser]);

    const handleSave = () => {
        if (!currentUser) return;

        // In a real app, we would validte and send API request
        // Here we update the mock store
        updateUser(currentUser.id, {
            name,
            avatar,
            // email and role typically read-only or require special permissions
        });

        alert("Cập nhật hồ sơ thành công!");
    };

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <p className="text-muted-foreground">Vui lòng đăng nhập để xem hồ sơ.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin chung</CardTitle>
                        <CardDescription>Quản lý thông tin hiển thị của bạn trên hệ thống.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center space-y-4 mb-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={avatar} alt={name} />
                                <AvatarFallback className="text-lg">{name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm text-muted-foreground">Ảnh đại diện được quản lý bởi Gravatar hoặc URL bên ngoài.</div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Họ và tên</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="avatar">URL Ảnh đại diện</Label>
                            <Input id="avatar" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://github.com/shadcn.png" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSave}>Lưu thay đổi</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tài khoản & Bảo mật</CardTitle>
                        <CardDescription>Thông tin đăng nhập và vai trò.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={email} disabled className="bg-muted" />
                            <p className="text-[0.8rem] text-muted-foreground">Email không thể thay đổi.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Vai trò</Label>
                            <Input
                                id="role"
                                value={role === "admin" ? "Quản trị viên" : role === "manager" ? "Quản lý" : "Nhân viên"}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-[0.8rem] text-muted-foreground">Vai trò được cấp bởi quản trị viên hệ thống.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
