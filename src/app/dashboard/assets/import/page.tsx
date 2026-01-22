"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload } from "lucide-react";

const SAMPLE_JSON = `[
  {
    "code": "TS-NEW-01",
    "name": "Máy chiếu Sony",
    "price": 15000000,
    "category": "electronics",
    "status": "ACTIVE"
  },
  {
    "code": "TS-NEW-02",
    "name": "Bàn họp lớn",
    "price": 5000000,
    "category": "furniture",
    "status": "ACTIVE"
  }
]`;

export default function ImportPage() {
    const addAsset = useAppStore((state) => state.addAsset);
    const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [error, setError] = useState("");

    const handlePreview = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            if (!Array.isArray(parsed)) {
                setError("Dữ liệu phải là một mảng JSON.");
                return;
            }
            setPreviewData(parsed);
            setError("");
        } catch (e) {
            setError("Lỗi cú pháp JSON. Vui lòng kiểm tra lại.");
            setPreviewData([]);
        }
    };

    const handleImport = () => {
        if (previewData.length === 0) return;

        previewData.forEach((item) => {
            addAsset({
                id: `import_${Date.now()}_${Math.random()}`,
                code: item.code,
                name: item.name,
                status: item.status || "ACTIVE",
                price: item.price || 0,
                location: "Kho nhập",
                purchaseDate: new Date().toISOString().slice(0, 10),
                specifications: {},
            } as any);
        });

        alert(`Đã nhập thành công ${previewData.length} tài sản!`);
        setPreviewData([]);
        setJsonInput("[]");
    };

    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight">Nhập hàng theo lô (Batch Import)</h1>

            <div className="grid gap-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">Dữ liệu JSON (Mô phỏng Excel/CSV)</label>
                    <Textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} className="font-mono h-[200px]" />
                    <Button className="mt-2" variant="outline" onClick={handlePreview}>
                        Xem trước dữ liệu
                    </Button>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Lỗi</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {previewData.length > 0 && (
                    <div className="border rounded-md mt-4">
                        <div className="p-4 bg-muted/20 flex justify-between items-center border-b">
                            <h3 className="font-semibold">Kết quả xem trước ({previewData.length} dòng)</h3>
                            <Button onClick={handleImport}>
                                <Upload className="mr-2 h-4 w-4" /> Xác nhận Nhập kho
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã</TableHead>
                                    <TableHead>Tên</TableHead>
                                    <TableHead>Giá</TableHead>
                                    <TableHead>Danh mục</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {previewData.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{row.code}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.price}</TableCell>
                                        <TableCell>{row.category}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}
