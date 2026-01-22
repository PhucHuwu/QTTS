export type Role = "ADMIN" | "MANAGER" | "WAREHOUSE_KEEPER" | "USER";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
}

export interface AssetCategory {
    id: string;
    name: string;
    code: string;
    parentId?: string;
    description?: string;
}

export interface Supplier {
    id: string;
    name: string;
    code: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    address?: string;
}

export interface Location {
    id: string;
    name: string;
    code: string;
    parentId?: string; // For hierarchy (Floor -> Room)
}

export type AssetStatus = "ACTIVE" | "BROKEN" | "LIQUIDATED" | "MAINTENANCE" | "LOST";

export interface Asset {
    id: string;
    code: string;
    name: string;
    categoryId: string;
    purchaseDate: string;
    price: number;
    status: AssetStatus;
    location: string;
    managerId: string; // User ID
    specifications: Record<string, any>;
    image?: string;
}

export interface AuditLog {
    id: string;
    action: string;
    userId: string;
    timestamp: string;
    details: string;
}
