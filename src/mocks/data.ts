import { User, Asset, AssetCategory } from "@/types/mock";

export const MOCK_USERS: User[] = [
    {
        id: "u1",
        name: "Nguyễn Văn Admin",
        email: "admin@qtts.com",
        role: "ADMIN",
        avatar: "/avatars/01.png",
    },
    {
        id: "u2",
        name: "Trần Quản Lý",
        email: "manager@qtts.com",
        role: "MANAGER",
        avatar: "/avatars/02.png",
    },
    {
        id: "u3",
        name: "Lê Thủ Kho",
        email: "warehouse@qtts.com",
        role: "WAREHOUSE_KEEPER",
        avatar: "/avatars/03.png",
    },
    {
        id: "u4",
        name: "Phạm Nhân Viên",
        email: "user@qtts.com",
        role: "USER",
        avatar: "/avatars/04.png",
    },
];

export const MOCK_CATEGORIES: AssetCategory[] = [
    { id: "c1", name: "Máy tính xách tay", code: "LT", parentId: "electronics" },
    { id: "c2", name: "Máy tính để bàn", code: "PC", parentId: "electronics" },
    { id: "c3", name: "Bàn ghế văn phòng", code: "FUR", parentId: "furniture" },
    { id: "c4", name: "Xe ô tô", code: "CAR", parentId: "vehicle" },
    { id: "electronics", name: "Thiết bị điện tử", code: "ELE", parentId: "" },
    { id: "furniture", name: "Nội thất", code: "FNI", parentId: "" },
    { id: "vehicle", name: "Phương tiện vận tải", code: "VEH", parentId: "" },
];

export const MOCK_SUPPLIERS: any[] = [
    { id: "s1", name: "Công ty TNHH Công Nghệ A", code: "SUP001", contactPerson: "Nguyễn Văn Sale", phone: "0901234567" },
    { id: "s2", name: "Nội thất Hòa Phát", code: "SUP002", contactPerson: "Lê Thị Bàn", phone: "0909876543" },
];

export const MOCK_LOCATIONS: any[] = [
    { id: "l1", name: "Tòa nhà A", code: "BLD-A" },
    { id: "l2", name: "Tầng 1", code: "F1", parentId: "l1" },
    { id: "l3", name: "Phòng IT", code: "R101", parentId: "l2" },
    { id: "l4", name: "Phòng Họp", code: "R102", parentId: "l2" },
];

export const MOCK_ASSETS: Asset[] = [
    {
        id: "a1",
        code: "TS0001",
        name: "MacBook Pro M3",
        categoryId: "c1",
        purchaseDate: "2025-01-15",
        price: 45000000,
        status: "ACTIVE",
        location: "Phòng IT",
        managerId: "u4",
        specifications: { ram: "16GB", ssd: "512GB" },
    },
    {
        id: "a2",
        code: "TS0002",
        name: "Dell XPS 15",
        categoryId: "c1",
        purchaseDate: "2024-11-20",
        price: 38000000,
        status: "MAINTENANCE",
        location: "Phòng Kinh Doanh",
        managerId: "u2",
        specifications: { ram: "32GB", ssd: "1TB" },
    },
    {
        id: "a3",
        code: "TS0003",
        name: "Ghế Ergonomic",
        categoryId: "c3",
        purchaseDate: "2025-01-05",
        price: 8500000,
        status: "ACTIVE",
        location: "Phòng Giám Đốc",
        managerId: "u1",
        specifications: { brand: "Herman Miller" },
    },
];
