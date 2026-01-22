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

export interface MaintenanceTicket {
    id: string;
    assetId: string;
    description: string;
    requestDate: string;
    completionDate?: string;
    status: "PENDING" | "COMPLETED";
    cost?: number;
}

export interface AuditSession {
    id: string;
    code: string;
    name: string;
    date: string;
    status: "PENDING" | "COMPLETED";
    location: string;
    notes?: string;
}

export interface TransferRecord {
    id: string;
    assetId: string;
    fromLocation: string;
    toLocation: string;
    fromManager: string;
    toManager: string;
    date: string;
    reason: string;
}

export interface MasterData {
    id: string;
    type: "USAGE_QUOTA" | "ASSET_STATE" | "UNIT" | "POSITION";
    name: string;
    code: string;
    description?: string;
    active: boolean;
}

export interface SystemLog {
    id: string;
    action: string; // e.g., "LOGIN", "CREATE_ASSET", "UPDATE_PERMISSION"
    userId: string;
    userName: string;
    timestamp: string;
    details: string;
    severity: "INFO" | "WARNING" | "ERROR";
}

export interface Permission {
    code: string;
    name: string;
    module: string;
}

export type RolePermissions = Record<Role, string[]>;
