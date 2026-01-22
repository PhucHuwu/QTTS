export default function InventoryPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-primary">Phân hệ Quản lý Vật tư</h1>
            <p className="text-xl text-muted-foreground">Chức năng đang được phát triển (Module B)</p>
            <div className="max-w-md text-sm text-left bg-muted p-4 rounded-md">
                <p className="font-bold mb-2">Tính năng sắp ra mắt:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Danh mục Vật tư & Kho</li>
                    <li>Nhập / Xuất / Điều chuyển vật tư</li>
                    <li>Kiểm kê vật tư định kỳ</li>
                    <li>Báo cáo tồn kho</li>
                </ul>
            </div>
        </div>
    );
}
