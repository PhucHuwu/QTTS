"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AuditExecutionPage() {
    const router = useRouter();
    const { id } = useParams();
    const assets = useAppStore((state) => state.assets);

    // Mock checking state: { assetId: { status, note } }
    const [auditData, setAuditData] = useState<Record<string, any>>({});

    const handleStatusChange = (assetId: string, status: string) => {
        setAuditData((prev) => ({
            ...prev,
            [assetId]: { ...prev[assetId], status },
        }));
    };

    const handleNoteChange = (assetId: string, note: string) => {
        setAuditData((prev) => ({
            ...prev,
            [assetId]: { ...prev[assetId], note },
        }));
    };

    const handleFinish = () => {
        alert("Đã hoàn thành kiểm kê! Cập nhật trạng thái tài sản thành công.");
        router.push("/dashboard/assets/audit");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/assets/audit">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">Thực hiện kiểm kê</h1>
                        <p className="text-sm text-muted-foreground">Mã đợt: KK-{id} - Phạm vi: Toàn bộ</p>
                    </div>
                </div>
                <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
                    <Save className="mr-2 h-4 w-4" /> Hoàn tất & Chốt số liệu
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã TS</TableHead>
                            <TableHead>Tên tài sản</TableHead>
                            <TableHead>Hiện trạng (Hệ thống)</TableHead>
                            <TableHead className="w-[200px]">Đánh giá thực tế</TableHead>
                            <TableHead>Ghi chú / Chênh lệch</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assets.map((asset) => (
                            <TableRow key={asset.id}>
                                <TableCell className="font-medium">{asset.code}</TableCell>
                                <TableCell>{asset.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{asset.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Select value={auditData[asset.id]?.status || "OK"} onValueChange={(v) => handleStatusChange(asset.id, v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="OK">Khớp / Bình thường</SelectItem>
                                            <SelectItem value="WRONG_LOCATION">Sai vị trí</SelectItem>
                                            <SelectItem value="QLY_DOWN">Kém phẩm chất</SelectItem>
                                            <SelectItem value="MISSING">Thất lạc</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Input
                                        placeholder="Ghi chú..."
                                        value={auditData[asset.id]?.note || ""}
                                        onChange={(e) => handleNoteChange(asset.id, e.target.value)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
