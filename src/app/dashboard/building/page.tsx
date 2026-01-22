export default function BuildingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-primary">Phân hệ Quản lý Tòa nhà</h1>
            <p className="text-xl text-muted-foreground">Chức năng đang được phát triển (Module C)</p>
            <div className="max-w-md text-sm text-left bg-muted p-4 rounded-md">
                <p className="font-bold mb-2">Tính năng sắp ra mắt:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Quản lý hợp đồng cho thuê</li>
                    <li>Quản lý chi phí vận hành</li>
                    <li>Theo dõi bảo trì hệ thống kỹ thuật</li>
                    <li>Báo cáo doanh thu / chi phí tòa nhà</li>
                </ul>
            </div>
        </div>
    );
}
