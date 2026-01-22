import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Asset, AssetCategory, Supplier, Location } from "@/types/mock";
import { MOCK_USERS, MOCK_ASSETS, MOCK_CATEGORIES, MOCK_SUPPLIERS, MOCK_LOCATIONS } from "@/mocks/data";

export interface AppState {
    currentUser: User | null;
    users: User[];
    assets: Asset[];
    categories: AssetCategory[];
    suppliers: Supplier[];
    locations: Location[];

    // Actions
    login: (email: string) => boolean;
    logout: () => void;

    // Asset Actions
    addAsset: (asset: Asset) => void;
    updateAsset: (id: string, updates: Partial<Asset>) => void;
    deleteAsset: (id: string) => void;

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

            login: (email: string) => {
                const user = get().users.find((u) => u.email === email);
                if (user) {
                    set({ currentUser: user });
                    return true;
                }
                return false;
            },

            logout: () => set({ currentUser: null }),

            addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
            updateAsset: (id, updates) =>
                set((state) => ({
                    assets: state.assets.map((a) => (a.id === id ? { ...a, ...updates } : a)),
                })),
            deleteAsset: (id) => set((state) => ({ assets: state.assets.filter((a) => a.id !== id) })),

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
            }),
        },
    ),
);
