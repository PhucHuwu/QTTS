"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MaintenanceReportPage() {
    const router = useRouter();
    const assets = useAppStore((state) => state.assets);
    const users = useAppStore((state) => state.users);
    const updateAsset = useAppStore((state) => state.updateAsset);

    const activeAssets = assets.filter((a) => a.status === "ACTIVE");

    const [selectedAssetId, setSelectedAssetId] = useState("");
    const [issueType, setIssueType] = useState("BROKEN"); // BROKEN or MAINTENANCE
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("MEDIUM");

    const handleSubmit = () => {
        if (!selectedAssetId || !description) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        updateAsset(selectedAssetId, {
            status: issueType as any,
            // In a real app, we would add a maintenance record to a separate table
            specifications: {
                ...assets.find((a) => a.id === selectedAssetId)?.specifications,
                lastIssue: description,
                lastIssueDate: new Date().toISOString(),
            },
        });

        alert("Đã gửi yêu cầu thành công!");
        router.push("/dashboard/assets/maintenance");
    };

    return (
        <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/assets/maintenance">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">Báo hỏng / Yêu cầu Bảo trì</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin phiếu yêu cầu</CardTitle>
                    <CardDescription>Điền thông tin sự cố hoặc yêu cầu bảo trì định kỳ.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Chọn tài sản</Label>
                        <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Tìm tài sản..." />
                            </SelectTrigger>
                            <SelectContent>
                                {activeAssets.map((a) => (
                                    <SelectItem key={a.id} value={a.id}>
                                        {a.code} - {a.name} ({a.location})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Loại yêu cầu</Label>
                        <Select value={issueType} onValueChange={setIssueType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BROKEN">Báo hỏng / Sự cố (Cần sửa chữa)</SelectItem>
                                <SelectItem value="MAINTENANCE">Bảo dưỡng định kỳ</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Mức độ ưu tiên</Label>
                        <Select value={priority} onValueChange={setPriority}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="HIGH">Cao (Cần xử lý gấp)</SelectItem>
                                <SelectItem value="MEDIUM">Trung bình</SelectItem>
                                <SelectItem value="LOW">Thấp</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Mô tả chi tiết sự cố</Label>
                        <Textarea
                            placeholder="Mô tả hiện trạng, nguyên nhân dự đoán..."
                            className="min-h-[100px]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <Button className="w-full" onClick={handleSubmit}>
                        Gửi yêu cầu
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
