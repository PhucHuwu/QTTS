import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "./store";
import { act } from "react";

describe("Zustand Store", () => {
    beforeEach(() => {
        // Reset store state if needed, but for now we just rely on fresh tests
        // Note: Zustand persistence might persist state across tests if running in same env,
        // but jsdom typically resets localstorage between files or we can mock it.
        // For simplicity, we just test basic actions.
        const { logout } = useAppStore.getState();
        act(() => {
            logout();
        });
    });

    it("should have initial state", () => {
        const state = useAppStore.getState();
        expect(state.currentUser).toBeNull();
        expect(state.users.length).toBeGreaterThan(0);
        expect(state.assets.length).toBeGreaterThan(0);
    });

    it("should login successfully with valid email", () => {
        const { login } = useAppStore.getState();
        let success = false;
        act(() => {
            success = login("admin@qtts.com");
        });
        expect(success).toBe(true);
        expect(useAppStore.getState().currentUser?.email).toBe("admin@qtts.com");
    });

    it("should fail login with invalid email", () => {
        const { login } = useAppStore.getState();
        let success = false;
        act(() => {
            success = login("invalid@email.com");
        });
        expect(success).toBe(false);
        expect(useAppStore.getState().currentUser).toBeNull();
    });

    it("should add new asset", () => {
        const { addAsset } = useAppStore.getState();
        const newAsset = {
            id: "test-asset-1",
            code: "TEST001",
            name: "Test Asset",
            status: "ACTIVE",
            price: 1000,
            location: "Test Loc",
            purchaseDate: "2025-01-01",
            specifications: {},
        };

        act(() => {
            addAsset(newAsset as any);
        });

        const state = useAppStore.getState();
        expect(state.assets).toContainEqual(expect.objectContaining({ code: "TEST001" }));
    });
});
