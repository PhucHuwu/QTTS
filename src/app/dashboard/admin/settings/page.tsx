"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch"; // Removed
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
// import { toast } from "sonner"; // Removed

export default function SettingsPage() {
    const systemSettings = useAppStore((state) => state.systemSettings);
    const updateSystemSettings = useAppStore((state) => state.updateSystemSettings);
    const addSystemLog = useAppStore((state) => state.addSystemLog);
    const currentUser = useAppStore((state) => state.currentUser);

    const [formData, setFormData] = useState(systemSettings);

    useEffect(() => {
        setFormData(systemSettings);
    }, [systemSettings]);

    const handleSave = () => {
        updateSystemSettings(formData);
        addSystemLog({
            action: "UPDATE_SETTINGS",
            userId: currentUser?.id || "system",
            userName: currentUser?.name || "System",
            details: "Updated system settings",
            severity: "WARNING",
        });
        alert("Đã lưu cấu hình hệ thống thành công.");
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Cài đặt tham số hệ thống</h1>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin chung</CardTitle>
                        <CardDescription>Cấu hình thông tin cơ bản của đơn vị.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tên đơn vị / Công ty</Label>
                            <Input value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Định dạng ngày tháng</Label>
                            <Input value={formData.dateFormat} onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Thông báo & Cảnh báo</CardTitle>
                        <CardDescription>Cấu hình gửi email và cảnh báo bảo trì.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Gửi email thông báo</Label>
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={formData.emailNotifications}
                                onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Gửi SMS thông báo</Label>
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={formData.smsNotifications}
                                onChange={(e) => setFormData({ ...formData, smsNotifications: e.target.checked })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Cảnh báo bảo trì trước (ngày)</Label>
                            <Input
                                type="number"
                                value={formData.maintenanceAlertDays}
                                onChange={(e) => setFormData({ ...formData, maintenanceAlertDays: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSave}>Lưu thay đổi</Button>
                </div>
            </div>
        </div>
    );
}
