import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Wrench, Users, BarChart3, DollarSign, Shield } from "lucide-react";

export default function BuildingPage() {
    const features = [
        {
            title: "Hồ sơ & Hợp đồng",
            description: "Quản lý hồ sơ pháp lý, thiết kế, hợp đồng dịch vụ, bảo hiểm và chi phí vận hành",
            icon: FileText,
            href: "/dashboard/building/documents",
            count: "7 loại hồ sơ",
            color: "text-blue-500",
        },
        {
            title: "Thiết bị & Bảo trì",
            description: "Quản lý thiết bị tòa nhà, lập lịch bảo trì định kỳ và theo dõi lịch sử",
            icon: Wrench,
            href: "/dashboard/building/equipment",
            count: "4 thiết bị",
            color: "text-orange-500",
        },
        {
            title: "Khách thuê",
            description: "Quản lý thông tin khách thuê, hợp đồng và thanh toán tiền thuê",
            icon: Users,
            href: "/dashboard/building/tenants",
            count: "3 khách thuê",
            color: "text-green-500",
        },
        {
            title: "Báo cáo & Thống kê",
            description: "Báo cáo doanh thu, chi phí, công nợ và các báo cáo vận hành tòa nhà",
            icon: BarChart3,
            href: "/dashboard/building/reports",
            count: "6 loại báo cáo",
            color: "text-purple-500",
        },
    ];

    const stats = [
        { label: "Tổng khách thuê", value: "3", icon: Users, color: "text-blue-500" },
        { label: "Diện tích cho thuê", value: "1,200 m²", icon: Shield, color: "text-green-500" },
        { label: "Doanh thu tháng", value: "456 tr", icon: DollarSign, color: "text-purple-500" },
        { label: "Thiết bị quản lý", value: "4", icon: Wrench, color: "text-orange-500" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Quản lý vận hành tòa nhà</h1>
                <p className="text-muted-foreground">Hệ thống quản lý tòa nhà toàn diện</p>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Feature Cards */}
            <div className="grid gap-6 md:grid-cols-2">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <Link key={index} href={feature.href}>
                            <Card className="h-full hover:bg-accent transition-colors cursor-pointer">
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg bg-muted ${feature.color}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle>{feature.title}</CardTitle>
                                            <CardDescription className="mt-1">{feature.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground">{feature.count}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Module Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Về Quản lý vận hành tòa nhà</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h4 className="font-medium mb-2">Quản trị & Vận hành</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Quản lý hồ sơ pháp lý, thiết kế</li>
                                <li>• Quản lý thiết bị tòa nhà</li>
                                <li>• Theo dõi chi phí vận hành</li>
                                <li>• Quản lý hợp đồng dịch vụ</li>
                                <li>• Theo dõi bảo hiểm</li>
                                <li>• Lập lịch bảo trì</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Khách thuê & Báo cáo</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Quản lý khách thuê</li>
                                <li>• Quản lý hợp đồng thuê</li>
                                <li>• Theo dõi thanh toán & công nợ</li>
                                <li>• Báo cáo doanh thu & chi phí</li>
                                <li>• Báo cáo công nợ & bảo trì</li>
                                <li>• Báo cáo tổng hợp & tùy chỉnh</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
