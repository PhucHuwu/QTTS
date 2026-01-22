"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Asset } from "@/types/mock";

export default function NewAssetPage() {
    const router = useRouter();
    const addAsset = useAppStore((state) => state.addAsset);
    const categories = useAppStore((state) => state.categories);
    const currentUser = useAppStore((state) => state.currentUser);

    const [formData, setFormData] = useState<Partial<Asset>>({
        status: "ACTIVE",
        managerId: currentUser?.id || "u1",
        purchaseDate: new Date().toISOString().split("T")[0],
    });

    // Mock specification text
    const [specs, setSpecs] = useState('{\n  "brand": "",\n  "model": ""\n}');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation
        if (!formData.code || !formData.name || !formData.categoryId) return;

        try {
            const parsedSpecs = JSON.parse(specs);

            const newAsset: Asset = {
                id: `a${Date.now()}`,
                ...(formData as any), // Cast for simplicity in demo
                price: Number(formData.price) || 0,
                specifications: parsedSpecs,
            };

            addAsset(newAsset);
            router.push("/dashboard/assets");
        } catch (err) {
            alert("Lỗi JSON thông số kỹ thuật");
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
                <h1 className="text-xl font-bold">Thêm mới tài sản (Import)</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin tài sản</CardTitle>
                    <CardDescription>Nhập thông tin tài sản mới vào hệ thống.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Mã tài sản *</Label>
                                <Input
                                    placeholder="TS..."
                                    value={formData.code || ""}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tên tài sản *</Label>
                                <Input
                                    placeholder="Tên tài sản"
                                    value={formData.name || ""}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Loại tài sản</Label>
                                <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tình trạng</Label>
                                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Đang sử dụng</SelectItem>
                                        <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
                                        <SelectItem value="BROKEN">Hỏng</SelectItem>
                                        <SelectItem value="LIQUIDATED">Đã thanh lý</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Giá trị (VND)</Label>
                                <Input
                                    type="number"
                                    value={formData.price || ""}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Ngày mua</Label>
                                <Input
                                    type="date"
                                    value={formData.purchaseDate || ""}
                                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Vị trí / Bộ phận sử dụng</Label>
                            <Input
                                placeholder="Ví dụ: Phòng IT, Tầng 3..."
                                value={formData.location || ""}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Thông số kỹ thuật (JSON)</Label>
                            <Textarea rows={5} value={specs} onChange={(e) => setSpecs(e.target.value)} className="font-mono text-xs" />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => router.back()}>
                                Hủy
                            </Button>
                            <Button type="submit">
                                <Save className="mr-2 h-4 w-4" />
                                Lưu tài sản
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
