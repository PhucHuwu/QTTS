"use client";

import { useState } from "react";
import { Upload, Download, AlertCircle, CheckCircle2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface ImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    templateUrl?: string;
    onImportComplete: (data: any[]) => void;
}

export function ImportDialog({ open, onOpenChange, title, templateUrl = "/templates/import-template.xlsx", onImportComplete }: ImportDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [validationResults, setValidationResults] = useState<{
        valid: number;
        invalid: number;
        errors: string[];
    } | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setValidationResults(null);
        }
    };

    const handleValidate = async () => {
        if (!file) return;

        setIsProcessing(true);

        // Simulate file processing and validation
        setTimeout(() => {
            const mockResults = {
                valid: Math.floor(Math.random() * 50) + 10,
                invalid: Math.floor(Math.random() * 5),
                errors: ["Dòng 5: Thiếu mã tài sản", "Dòng 12: Định dạng ngày không hợp lệ", "Dòng 23: Đơn vị tính không tồn tại"].slice(
                    0,
                    Math.floor(Math.random() * 3)
                ),
            };
            setValidationResults(mockResults);
            setIsProcessing(false);
        }, 1500);
    };

    const handleImport = () => {
        if (!file || !validationResults || validationResults.invalid > 0) return;

        setIsProcessing(true);

        // Simulate import process
        setTimeout(() => {
            const mockData = Array.from({ length: validationResults.valid }, (_, i) => ({
                id: `IMPORT-${Date.now()}-${i}`,
                imported: true,
            }));

            onImportComplete(mockData);
            setIsProcessing(false);

            // Reset and close
            setFile(null);
            setValidationResults(null);
            onOpenChange(false);
        }, 1000);
    };

    const handleDownloadTemplate = () => {
        // In a real app, this would download the actual template file
        alert("Tải template mẫu: " + templateUrl);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Download Template */}
                    <div className="border rounded-lg p-4 bg-muted/50">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium">Bước 1: Tải file mẫu</h4>
                                <p className="text-sm text-muted-foreground">Tải file Excel mẫu và điền thông tin theo định dạng</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                                <Download className="mr-2 h-4 w-4" />
                                Tải mẫu
                            </Button>
                        </div>
                    </div>

                    {/* Upload File */}
                    <div className="border rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-3">Bước 2: Tải file lên</h4>
                        <div className="space-y-3">
                            <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                <div className="text-sm text-muted-foreground mb-2">
                                    {file ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="font-medium">{file.name}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setFile(null);
                                                    setValidationResults(null);
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        "Chọn file Excel để import"
                                    )}
                                </div>
                                <input type="file" accept=".xlsx,.xls" onChange={handleFileSelect} className="hidden" id="file-upload" />
                                <label htmlFor="file-upload">
                                    <Button variant="outline" size="sm" asChild>
                                        <span>Chọn file</span>
                                    </Button>
                                </label>
                            </div>

                            {file && !validationResults && (
                                <Button onClick={handleValidate} disabled={isProcessing} className="w-full">
                                    {isProcessing ? "Đang kiểm tra..." : "Kiểm tra dữ liệu"}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Validation Results */}
                    {validationResults && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border rounded-lg p-4 bg-green-50">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium">Hợp lệ</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-600">{validationResults.valid}</p>
                                </div>
                                <div className="border rounded-lg p-4 bg-red-50">
                                    <div className="flex items-center gap-2 mb-1">
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                        <span className="text-sm font-medium">Lỗi</span>
                                    </div>
                                    <p className="text-2xl font-bold text-red-600">{validationResults.invalid}</p>
                                </div>
                            </div>

                            {validationResults.errors.length > 0 && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="font-medium mb-2">Các lỗi cần sửa:</div>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            {validationResults.errors.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="flex gap-2">
                                <Button onClick={handleImport} disabled={validationResults.invalid > 0 || isProcessing} className="flex-1">
                                    {isProcessing ? "Đang import..." : `Import ${validationResults.valid} bản ghi`}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setFile(null);
                                        setValidationResults(null);
                                    }}
                                >
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
