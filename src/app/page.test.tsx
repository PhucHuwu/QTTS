import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./page";

// Mock useRouter
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

describe("LoginPage", () => {
    it("renders login title", () => {
        render(<LoginPage />);
        expect(screen.getByText("Đăng nhập QTTS")).toBeInTheDocument();
        expect(screen.getByText("Hệ thống Quản lý Tài sản (Demo)")).toBeInTheDocument();
    });

    it("renders demo accounts", () => {
        render(<LoginPage />);
        expect(screen.getByText(/Admin: admin@qtts.com/i)).toBeInTheDocument();
        expect(screen.getByText(/Quản lý: manager@qtts.com/i)).toBeInTheDocument();
        expect(screen.getByText(/Nhân viên: user@qtts.com/i)).toBeInTheDocument();
    });
});
