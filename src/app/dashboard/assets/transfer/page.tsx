"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

export default function AssetTransferPage() {
    const router = useRouter();
    const assets = useAppStore((state) => state.assets);
    const users = useAppStore((state) => state.users);
    const locations = useAppStore((state) => state.locations);
    const updateAsset = useAppStore((state) => state.updateAsset);

    const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
    const [targetLocation, setTargetLocation] = useState("");
    const [targetManager, setTargetManager] = useState("");
    const [transferDate, setTransferDate] = useState(new Date().toISOString().split("T")[0]);
    const [reason, setReason] = useState("");

    const handleTransfer = () => {
        if (selectedAssetIds.length === 0 || !targetLocation || !targetManager) {
            alert("Vui lòng chọn tài sản và thông tin điều chuyển đày đủ.");
            return;
        }

        // Update workflow
        selectedAssetIds.forEach((id) => {
            updateAsset(id, {
                location: locations.find((l) => l.id === targetLocation)?.name || targetLocation,
                managerId: targetManager,
            });
        });

        alert(`Đã điều chuyển ${selectedAssetIds.length} tài sản thành công!`);
        router.push("/dashboard/assets");
    };

    const toggleAsset = (id: string) => {
        if (selectedAssetIds.includes(id)) {
            setSelectedAssetIds(selectedAssetIds.filter((x) => x !== id));
        } else {
            setSelectedAssetIds([...selectedAssetIds, id]);
        }
    };

    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/assets">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">Điều chuyển / Bàn giao Tài sản</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>1. Chọn tài sản cần điều chuyển</CardTitle>
                        <CardDescription>Tích chọn các tài sản từ danh sách bên dưới.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] overflow-auto border rounded-md p-0">
                        <div className="divide-y">
                            {assets
                                .filter((a) => a.status === "ACTIVE" || a.status === "MAINTENANCE")
                                .map((asset) => (
                                    <div
                                        key={asset.id}
                                        className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                                        onClick={() => toggleAsset(asset.id)}
                                    >
                                        <Checkbox checked={selectedAssetIds.includes(asset.id)} />
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{asset.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {asset.code} - {asset.location}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                    <div className="p-4 border-t text-sm text-right">
                        Đã chọn: <strong>{selectedAssetIds.length}</strong> tài sản
                    </div>
                </Card>

                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>2. Thông tin điều chuyển</CardTitle>
                        <CardDescription>Nhập thông tin nơi đến và người nhận.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Ngày điều chuyển</Label>
                            <Input type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Vị trí mới (Phòng ban/Kho)</Label>
                            <Select value={targetLocation} onValueChange={setTargetLocation}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn vị trí" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((l) => (
                                        <SelectItem key={l.id} value={l.id}>
                                            {l.name} ({l.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Người tiếp nhận / Quản lý mới</Label>
                            <Select value={targetManager} onValueChange={setTargetManager}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nhân viên" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((u) => (
                                        <SelectItem key={u.id} value={u.id}>
                                            {u.name} ({u.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Lý do / Ghi chú</Label>
                            <Input placeholder="Ví dụ: Cấp mới cho nhân viên, luân chuyển..." value={reason} onChange={(e) => setReason(e.target.value)} />
                        </div>

                        <div className="pt-4">
                            <Button className="w-full" onClick={handleTransfer} disabled={selectedAssetIds.length === 0}>
                                <ArrowRightLeft className="mr-2 h-4 w-4" />
                                Xác nhận Điều chuyển
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
