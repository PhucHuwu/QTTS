import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, MapPin, Truck } from "lucide-react";

export default function CategoriesIndexPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">Quản lý Danh mục</h1>
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/dashboard/categories/types">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardHeader className="flex flex-row items-center space-y-0 gap-4">
                            <BookOpen className="h-8 w-8 text-primary" />
                            <CardTitle>Loại tài sản</CardTitle>
                        </CardHeader>
                        <CardContent>Quản lý cây phân cấp loại tài sản.</CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/categories/locations">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardHeader className="flex flex-row items-center space-y-0 gap-4">
                            <MapPin className="h-8 w-8 text-primary" />
                            <CardTitle>Vị trí / Kho</CardTitle>
                        </CardHeader>
                        <CardContent>Quản lý danh mục kho, phòng ban, vị trí đặt tài sản.</CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/categories/suppliers">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardHeader className="flex flex-row items-center space-y-0 gap-4">
                            <Truck className="h-8 w-8 text-primary" />
                            <CardTitle>Nhà cung cấp</CardTitle>
                        </CardHeader>
                        <CardContent>Quản lý thông tin nhà cung cấp, đối tác.</CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
