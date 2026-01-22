"use client";

import { use } from "react";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Download, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { exportToExcel } from "@/lib/exportUtils";

export default function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const assets = useAppStore((state) => state.assets);
    const auditSessions = useAppStore((state) => state.auditSessions);
    const session = auditSessions.find((s) => s.id === resolvedParams.id);

    const [checkedAssets, setCheckedAssets] = useState<string[]>([]);

    if (!session) {
        return <div className="p-8 text-center">Không tìm thấy kỳ kiểm kê</div>;
    }

    // Filter assets by location for this audit
    const relevantAssets = assets.filter((a) => a.location === session.location);

    const toggleAsset = (id: string) => {
        if (checkedAssets.includes(id)) {
            setCheckedAssets(checkedAssets.filter((x) => x !== id));
        } else {
            setCheckedAssets([...checkedAssets, id]);
        }
    };

    const toggleAll = () => {
        if (checkedAssets.length === relevantAssets.length) {
            setCheckedAssets([]);
        } else {
            setCheckedAssets(relevantAssets.map((a) => a.id));
        }
    };

    const handleComplete = () => {
        if (checkedAssets.length === 0) {
            alert("Vui lòng kiểm tra ít nhất một tài sản!");
            return;
        }
        if (confirm(`Xác nhận hoàn thành kiểm kê ${checkedAssets.length}/${relevantAssets.length} tài sản?`)) {
            alert("Đã lưu kết quả kiểm kê!");
        }
    };

    const handleExport = () => {
        const exportData = relevantAssets.map((asset) => ({
            "Mã TS": asset.code,
            "Tên tài sản": asset.name,
            "Trạng thái": asset.status,
            "Vị trí": asset.location,
            "Giá trị": asset.price,
            "Đã kiểm tra": checkedAssets.includes(asset.id) ? "Có" : "Chưa",
        }));
        exportToExcel(exportData, `Kiem_ke_${session.code}_${new Date().toISOString().slice(0, 10)}`, "Kiểm kê");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/assets/audit">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{session.name}</h1>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            Mã: {session.code} · Vị trí: {session.location}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tiến độ kiểm kê</CardTitle>
                    <CardDescription>
                        Đã kiểm tra: {checkedAssets.length}/{relevantAssets.length} tài sản
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 bg-muted rounded-full h-4">
                            <div
                                className="bg-primary h-4 rounded-full transition-all"
                                style={{ width: `${(checkedAssets.length / relevantAssets.length) * 100}%` }}
                            />
                        </div>
                        <div className="text-sm font-medium">{((checkedAssets.length / relevantAssets.length) * 100).toFixed(0)}%</div>
                    </div>
                    <Button onClick={handleComplete} disabled={checkedAssets.length === 0} className="w-full mt-4">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Xác nhận kiểm kê ({checkedAssets.length} tài sản)
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách tài sản cần kiểm kê</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox checked={checkedAssets.length === relevantAssets.length} onCheckedChange={toggleAll} />
                                </TableHead>
                                <TableHead>Mã TS</TableHead>
                                <TableHead>Tên tài sản</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Giá trị</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {relevantAssets.map((asset) => (
                                <TableRow key={asset.id}>
                                    <TableCell>
                                        <Checkbox checked={checkedAssets.includes(asset.id)} onCheckedChange={() => toggleAsset(asset.id)} />
                                    </TableCell>
                                    <TableCell className="font-medium">{asset.code}</TableCell>
                                    <TableCell>{asset.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={asset.status === "ACTIVE" ? "default" : "secondary"}>{asset.status}</Badge>
                                    </TableCell>
                                    <TableCell>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(asset.price)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
