"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Edit, Download } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";

export default function BulkUpdatePage() {
    const assets = useAppStore((state) => state.assets);
    const locations = useAppStore((state) => state.locations);
    const users = useAppStore((state) => state.users);
    const updateAsset = useAppStore((state) => state.updateAsset);

    const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
    const [bulkLocation, setBulkLocation] = useState("");
    const [bulkManager, setBulkManager] = useState("");
    const [bulkStatus, setBulkStatus] = useState("");

    const toggleAsset = (id: string) => {
        if (selectedAssetIds.includes(id)) {
            setSelectedAssetIds(selectedAssetIds.filter((x) => x !== id));
        } else {
            setSelectedAssetIds([...selectedAssetIds, id]);
        }
    };

    const toggleAll = () => {
        if (selectedAssetIds.length === assets.length) {
            setSelectedAssetIds([]);
        } else {
            setSelectedAssetIds(assets.map((a) => a.id));
        }
    };

    const handleBulkUpdate = () => {
        if (selectedAssetIds.length === 0) {
            alert("Vui lòng chọn ít nhất một tài sản!");
            return;
        }

        if (!bulkLocation && !bulkManager && !bulkStatus) {
            alert("Vui lòng chọn ít nhất một trường cần cập nhật!");
            return;
        }

        if (confirm(`Xác nhận cập nhật ${selectedAssetIds.length} tài sản?`)) {
            selectedAssetIds.forEach((id) => {
                const updates: any = {};
                if (bulkLocation) {
                    const locationName = locations.find((l) => l.id === bulkLocation)?.name || bulkLocation;
                    updates.location = locationName;
                }
                if (bulkManager) updates.managerId = bulkManager;
                if (bulkStatus) updates.status = bulkStatus;

                updateAsset(id, updates);
            });

            alert(`Đã cập nhật ${selectedAssetIds.length} tài sản thành công!`);
            setSelectedAssetIds([]);
            setBulkLocation("");
            setBulkManager("");
            setBulkStatus("");
        }
    };

    const handleExport = () => {
        const selectedAssets = assets.filter((a) => selectedAssetIds.includes(a.id));
        const exportData = selectedAssets.map((asset) => ({
            "Mã TS": asset.code,
            "Tên tài sản": asset.name,
            "Trạng thái": asset.status,
            "Vị trí": asset.location,
            "Giá trị": asset.price,
            "Ngày mua": asset.purchaseDate,
        }));
        exportToExcel(exportData, `Cap_nhat_hang_loat_${new Date().toISOString().slice(0, 10)}`, "Cập nhật");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Edit className="h-6 w-6" />
                    Cập nhật hàng loạt tài sản
                </h1>
                <Button variant="outline" onClick={handleExport} disabled={selectedAssetIds.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Xuất Excel ({selectedAssetIds.length})
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Cập nhật thông tin hàng loạt</CardTitle>
                    <CardDescription>Chọn tài sản và thông tin muốn cập nhật đồng loạt</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Vị trí mới</Label>
                            <Select value={bulkLocation} onValueChange={setBulkLocation}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Không thay đổi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Không thay đổi</SelectItem>
                                    {locations.map((loc) => (
                                        <SelectItem key={loc.id} value={loc.id}>
                                            {loc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Người quản lý mới</Label>
                            <Select value={bulkManager} onValueChange={setBulkManager}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Không thay đổi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Không thay đổi</SelectItem>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Trạng thái mới</Label>
                            <Select value={bulkStatus} onValueChange={setBulkStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Không thay đổi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Không thay đổi</SelectItem>
                                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                    <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
                                    <SelectItem value="BROKEN">BROKEN</SelectItem>
                                    <SelectItem value="LIQUIDATED">LIQUIDATED</SelectItem>
                                    <SelectItem value="LOST">LOST</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleBulkUpdate} disabled={selectedAssetIds.length === 0} className="w-full">
                        <Edit className="mr-2 h-4 w-4" />
                        Cập nhật {selectedAssetIds.length} tài sản
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách tài sản ({selectedAssetIds.length} đã chọn)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox checked={selectedAssetIds.length === assets.length} onCheckedChange={toggleAll} />
                                </TableHead>
                                <TableHead>Mã TS</TableHead>
                                <TableHead>Tên tài sản</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Vị trí</TableHead>
                                <TableHead>Người quản lý</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assets.map((asset) => {
                                const manager = users.find((u) => u.id === asset.managerId);
                                return (
                                    <TableRow key={asset.id}>
                                        <TableCell>
                                            <Checkbox checked={selectedAssetIds.includes(asset.id)} onCheckedChange={() => toggleAsset(asset.id)} />
                                        </TableCell>
                                        <TableCell className="font-medium">{asset.code}</TableCell>
                                        <TableCell>{asset.name}</TableCell>
                                        <TableCell>{asset.status}</TableCell>
                                        <TableCell>{asset.location}</TableCell>
                                        <TableCell>{manager?.name}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
