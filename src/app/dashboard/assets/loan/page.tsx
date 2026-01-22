"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Handshake, Plus, ArrowLeftRight, Download } from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";
import Link from "next/link";

export default function LoanReturnPage() {
    const assets = useAppStore((state) => state.assets);
    const users = useAppStore((state) => state.users);
    const [loanRecords, setLoanRecords] = useState<any[]>([
        {
            id: "loan-001",
            assetId: assets[0]?.id,
            borrowerId: users[1]?.id,
            loanDate: "2026-01-15",
            expectedReturnDate: "2026-02-15",
            actualReturnDate: null,
            status: "LOANED",
            reason: "Sử dụng cho dự án tạm thời",
        },
    ]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedAssetId, setSelectedAssetId] = useState("");
    const [selectedBorrowerId, setSelectedBorrowerId] = useState("");
    const [expectedReturnDate, setExpectedReturnDate] = useState("");
    const [reason, setReason] = useState("");

    const availableAssets = assets.filter((a) => a.status === "ACTIVE");

    const handleCreateLoan = () => {
        if (!selectedAssetId || !selectedBorrowerId || !expectedReturnDate) return;

        const newLoan = {
            id: `loan-${Date.now()}`,
            assetId: selectedAssetId,
            borrowerId: selectedBorrowerId,
            loanDate: new Date().toISOString().slice(0, 10),
            expectedReturnDate,
            actualReturnDate: null,
            status: "LOANED",
            reason,
        };

        setLoanRecords([...loanRecords, newLoan]);
        setIsCreateOpen(false);
        setSelectedAssetId("");
        setSelectedBorrowerId("");
        setExpectedReturnDate("");
        setReason("");
        alert("Đã tạo phiếu cho mượn thành công!");
    };

    const handleReturn = (loanId: string) => {
        if (confirm("Xác nhận thu hồi tài sản?")) {
            setLoanRecords(
                loanRecords.map((loan) =>
                    loan.id === loanId
                        ? {
                              ...loan,
                              actualReturnDate: new Date().toISOString().slice(0, 10),
                              status: "RETURNED",
                          }
                        : loan,
                ),
            );
        }
    };

    const handleExport = () => {
        const exportData = loanRecords.map((loan) => {
            const asset = assets.find((a) => a.id === loan.assetId);
            const borrower = users.find((u) => u.id === loan.borrowerId);
            return {
                "Mã phiếu": loan.id,
                "Mã tài sản": asset?.code || "",
                "Tên tài sản": asset?.name || "",
                "Người mượn": borrower?.name || "",
                "Ngày mượn": loan.loanDate,
                "Ngày dự kiến trả": loan.expectedReturnDate,
                "Ngày trả thực tế": loan.actualReturnDate || "Chưa trả",
                "Trạng thái": loan.status === "LOANED" ? "Đang mượn" : "Đã trả",
                "Lý do": loan.reason,
            };
        });
        exportToExcel(exportData, `Phieu_cho_muon_${new Date().toISOString().slice(0, 10)}`, "Cho mượn");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Handshake className="h-6 w-6" />
                    Cho mượn & Thu hồi tài sản
                </h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo phiếu cho mượn
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo phiếu cho mượn tài sản</DialogTitle>
                                <DialogDescription>Chọn tài sản và người mượn để tạo phiếu.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label>Chọn tài sản</Label>
                                    <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn tài sản..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableAssets.map((a) => (
                                                <SelectItem key={a.id} value={a.id}>
                                                    {a.code} - {a.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Người mượn</Label>
                                    <Select value={selectedBorrowerId} onValueChange={setSelectedBorrowerId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn người mượn..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((u) => (
                                                <SelectItem key={u.id} value={u.id}>
                                                    {u.name} - {u.role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Ngày dự kiến trả</Label>
                                    <Input type="date" value={expectedReturnDate} onChange={(e) => setExpectedReturnDate(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Lý do mượn</Label>
                                    <Textarea placeholder="Ví dụ: Sử dụng cho dự án..." value={reason} onChange={(e) => setReason(e.target.value)} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateLoan} disabled={!selectedAssetId || !selectedBorrowerId || !expectedReturnDate}>
                                    Tạo phiếu
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách phiếu cho mượn</CardTitle>
                    <CardDescription>Quản lý tài sản đang được cho mượn và thu hồi</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã phiếu</TableHead>
                                <TableHead>Tài sản</TableHead>
                                <TableHead>Người mượn</TableHead>
                                <TableHead>Ngày mượn</TableHead>
                                <TableHead>Dự kiến trả</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loanRecords.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        Chưa có phiếu cho mượn nào.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                loanRecords.map((loan) => {
                                    const asset = assets.find((a) => a.id === loan.assetId);
                                    const borrower = users.find((u) => u.id === loan.borrowerId);
                                    return (
                                        <TableRow key={loan.id}>
                                            <TableCell className="font-medium">{loan.id}</TableCell>
                                            <TableCell>
                                                <Link href={`/dashboard/assets/${asset?.id}`} className="hover:underline hover:text-primary">
                                                    {asset?.code} - {asset?.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{borrower?.name}</TableCell>
                                            <TableCell>{loan.loanDate}</TableCell>
                                            <TableCell>{loan.expectedReturnDate}</TableCell>
                                            <TableCell>
                                                <Badge variant={loan.status === "LOANED" ? "secondary" : "default"}>
                                                    {loan.status === "LOANED" ? "Đang mượn" : "Đã trả"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {loan.status === "LOANED" && (
                                                    <Button size="sm" variant="outline" onClick={() => handleReturn(loan.id)}>
                                                        <ArrowLeftRight className="mr-2 h-4 w-4" />
                                                        Thu hồi
                                                    </Button>
                                                )}
                                                {loan.status === "RETURNED" && (
                                                    <span className="text-sm text-muted-foreground">Đã trả {loan.actualReturnDate}</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
