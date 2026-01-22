import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    User,
    Asset,
    AssetCategory,
    Supplier,
    Location,
    MaintenanceTicket,
    AuditSession,
    TransferRecord,
    MasterData,
    SystemLog,
    RolePermissions,
    Role,
} from "@/types/mock";
import { MOCK_USERS, MOCK_ASSETS, MOCK_CATEGORIES, MOCK_SUPPLIERS, MOCK_LOCATIONS } from "@/mocks/data";

export interface AppState {
    currentUser: User | null;
    users: User[];
    assets: Asset[];
    categories: AssetCategory[];
    suppliers: Supplier[];
    locations: Location[];

    // Advanced State
    maintenanceTickets: MaintenanceTicket[];
    auditSessions: AuditSession[];
    transferRecords: TransferRecord[];

    // Module A Complete State
    masterData: MasterData[];
    systemLogs: SystemLog[];
    rolePermissions: RolePermissions;

    // Actions
    login: (email: string) => boolean;
    logout: () => void;

    // Asset Actions
    addAsset: (asset: Asset) => void;
    updateAsset: (id: string, updates: Partial<Asset>) => void;
    deleteAsset: (id: string) => void;

    // Advanced Actions
    createMaintenanceTicket: (ticket: MaintenanceTicket) => void;
    completeMaintenanceTicket: (id: string) => void;
    createAuditSession: (session: AuditSession) => void;
    updateAuditSession: (id: string, updates: Partial<AuditSession>) => void;
    logTransfer: (record: TransferRecord) => void;

    // Module A Actions
    addMasterData: (item: MasterData) => void;
    updateMasterData: (id: string, updates: Partial<MasterData>) => void;
    deleteMasterData: (id: string) => void;
    addSystemLog: (log: Omit<SystemLog, "id" | "timestamp">) => void;
    updateRolePermissions: (role: Role, permissions: string[]) => void;

    // Category Actions
    addCategory: (item: AssetCategory) => void;
    updateCategory: (id: string, updates: Partial<AssetCategory>) => void;
    deleteCategory: (id: string) => void;

    // Supplier Actions
    addSupplier: (item: Supplier) => void;
    updateSupplier: (id: string, updates: Partial<Supplier>) => void;
    deleteSupplier: (id: string) => void;

    // Location Actions
    addLocation: (item: Location) => void;
    updateLocation: (id: string, updates: Partial<Location>) => void;
    deleteLocation: (id: string) => void;

    // User Actions
    addUser: (item: User) => void;
    updateUser: (id: string, updates: Partial<User>) => void;
    deleteUser: (id: string) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            currentUser: null,
            users: MOCK_USERS,
            assets: MOCK_ASSETS,
            categories: MOCK_CATEGORIES,
            suppliers: MOCK_SUPPLIERS,
            locations: MOCK_LOCATIONS,

            maintenanceTickets: [],
            auditSessions: [],
            transferRecords: [],

            masterData: [],
            systemLogs: [],
            rolePermissions: {
                ADMIN: ["ALL"],
                MANAGER: ["ASSET_READ", "ASSET_WRITE", "REPORT_READ", "CATEGORY_READ"],
                WAREHOUSE_KEEPER: ["ASSET_READ", "ASSET_WRITE", "INVENTORY_READ", "INVENTORY_WRITE"],
                USER: ["ASSET_READ", "PROFILE_READ"],
            },

            login: (email: string) => {
                const user = get().users.find((u) => u.email === email);
                if (user) {
                    set({ currentUser: user });
                    get().addSystemLog({
                        action: "LOGIN",
                        userId: user.id,
                        userName: user.name,
                        details: "User logged in successfully",
                        severity: "INFO",
                    });
                    return true;
                }
                return false;
            },

            logout: () => {
                const user = get().currentUser;
                if (user) {
                    get().addSystemLog({
                        action: "LOGOUT",
                        userId: user.id,
                        userName: user.name,
                        details: "User logged out",
                        severity: "INFO",
                    });
                }
                set({ currentUser: null });
            },

            addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
            updateAsset: (id, updates) =>
                set((state) => ({
                    assets: state.assets.map((a) => (a.id === id ? { ...a, ...updates } : a)),
                })),
            deleteAsset: (id) => set((state) => ({ assets: state.assets.filter((a) => a.id !== id) })),

            // Advanced Actions Implementation
            createMaintenanceTicket: (ticket) =>
                set((state) => {
                    // Auto update asset status
                    const updatedAssets = state.assets.map((a) => (a.id === ticket.assetId ? { ...a, status: "MAINTENANCE" as const } : a));
                    return {
                        maintenanceTickets: [...state.maintenanceTickets, ticket],
                        assets: updatedAssets,
                    };
                }),
            completeMaintenanceTicket: (id) =>
                set((state) => {
                    const ticket = state.maintenanceTickets.find((t) => t.id === id);
                    if (!ticket) return {};

                    // Update ticket status
                    const updatedTickets = state.maintenanceTickets.map((t) =>
                        t.id === id ? { ...t, status: "COMPLETED" as const, completionDate: new Date().toISOString().slice(0, 10) } : t,
                    );

                    // Update asset status
                    const updatedAssets = state.assets.map((a) => (a.id === ticket.assetId ? { ...a, status: "ACTIVE" as const } : a));

                    return {
                        maintenanceTickets: updatedTickets,
                        assets: updatedAssets,
                    };
                }),
            createAuditSession: (session) => set((state) => ({ auditSessions: [...state.auditSessions, session] })),
            updateAuditSession: (id, updates) =>
                set((state) => ({
                    auditSessions: state.auditSessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
                })),
            logTransfer: (record) => set((state) => ({ transferRecords: [...state.transferRecords, record] })),

            // Module A Actions
            addMasterData: (item) => set((state) => ({ masterData: [...state.masterData, item] })),
            updateMasterData: (id, updates) =>
                set((state) => ({
                    masterData: state.masterData.map((d) => (d.id === id ? { ...d, ...updates } : d)),
                })),
            deleteMasterData: (id) => set((state) => ({ masterData: state.masterData.filter((d) => d.id !== id) })),

            addSystemLog: (log) =>
                set((state) => ({
                    systemLogs: [
                        {
                            id: `log-${Date.now()}-${Math.random()}`,
                            timestamp: new Date().toISOString(),
                            ...log,
                        },
                        ...state.systemLogs,
                    ],
                })),

            updateRolePermissions: (role, permissions) =>
                set((state) => ({
                    rolePermissions: { ...state.rolePermissions, [role]: permissions },
                })),

            // Category Actions
            addCategory: (item) => set((state) => ({ categories: [...state.categories, item] })),
            updateCategory: (id, updates) =>
                set((state) => ({
                    categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
                })),
            deleteCategory: (id) => set((state) => ({ categories: state.categories.filter((c) => c.id !== id) })),

            // Supplier Actions
            addSupplier: (item) => set((state) => ({ suppliers: [...state.suppliers, item] })),
            updateSupplier: (id, updates) =>
                set((state) => ({
                    suppliers: state.suppliers.map((s) => (s.id === id ? { ...s, ...updates } : s)),
                })),
            deleteSupplier: (id) => set((state) => ({ suppliers: state.suppliers.filter((s) => s.id !== id) })),

            // Location Actions
            addLocation: (item) => set((state) => ({ locations: [...state.locations, item] })),
            updateLocation: (id, updates) =>
                set((state) => ({
                    locations: state.locations.map((l) => (l.id === id ? { ...l, ...updates } : l)),
                })),
            deleteLocation: (id) => set((state) => ({ locations: state.locations.filter((l) => l.id !== id) })),

            // User Actions
            addUser: (item) => set((state) => ({ users: [...state.users, item] })),
            updateUser: (id, updates) =>
                set((state) => ({
                    users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
                })),
            deleteUser: (id) => set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
        }),
        {
            name: "qtts-storage",
            partialize: (state) => ({
                currentUser: state.currentUser,
                assets: state.assets,
                categories: state.categories,
                suppliers: state.suppliers,
                locations: state.locations,
                maintenanceTickets: state.maintenanceTickets,
                auditSessions: state.auditSessions,
                transferRecords: state.transferRecords,
                masterData: state.masterData,
                systemLogs: state.systemLogs,
                rolePermissions: state.rolePermissions,
            }),
        },
    ),
);
