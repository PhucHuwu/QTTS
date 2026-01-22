"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function LiquidationPage() {
    const router = useRouter();
    const assets = useAppStore((state) => state.assets);
    const updateAsset = useAppStore((state) => state.updateAsset);

    const activeAssets = assets.filter((a) => a.status === "ACTIVE" || a.status === "BROKEN");

    const [selectedAssetId, setSelectedAssetId] = useState("");
    const [reason, setReason] = useState("");
    const [price, setPrice] = useState("0");

    const handleSubmit = () => {
        if (!selectedAssetId) return;

        if (confirm("Xác nhận thanh lý tài sản này? Hành động không thể hoàn tác.")) {
            updateAsset(selectedAssetId, { status: "LIQUIDATED" });
            alert("Thanh lý thành công!");
            router.push("/dashboard/assets");
        }
    };

    return (
        <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/assets">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">Thanh lý Tài sản</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Đề xuất Thanh lý</CardTitle>
                    <CardDescription>Tạo phiếu thanh lý cho tài sản hư hỏng hoặc hết hạn sử dụng.</CardDescription>
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
                                        {a.code} - {a.name} ({a.status})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Lý do thanh lý</Label>
                        <Input placeholder="Hư hỏng không thể sửa chữa, hết khấu hao..." value={reason} onChange={(e) => setReason(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>Giá trị thu hồi (VNĐ)</Label>
                        <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>

                    <Button variant="destructive" className="w-full" onClick={handleSubmit} disabled={!selectedAssetId}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xác nhận Thanh lý
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
