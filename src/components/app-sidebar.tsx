"use client";

import * as React from "react";
import {
    BookOpen,
    Bot,
    Command,
    Frame,
    LifeBuoy,
    Map,
    PieChart,
    Send,
    Settings2,
    SquareTerminal,
    ArrowRightLeft,
    Package,
    Users,
    LayoutDashboard,
    Box,
    FileText,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { useAppStore, AppState } from "@/lib/store";
import { Role } from "@/types/mock";

// Mock data for sidebar
const data = {
    user: {
        name: "QTTS Admin",
        email: "admin@qtts.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "QTTS System",
            logo: Command,
            plan: "Enterprise",
        },
    ],
    navMain: [
        {
            title: "Tổng quan",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
        },
        {
            title: "Quản trị hệ thống",
            url: "#",
            icon: Settings2,
            items: [
                { title: "Người dùng", url: "/dashboard/admin/users" },
                { title: "Phân quyền", url: "/dashboard/admin/roles" },
                { title: "Nhật ký hệ thống", url: "/dashboard/admin/logs" },
            ],
        },
        {
            title: "Quản lý tài sản",
            url: "/dashboard/assets",
            icon: Package,
            items: [{ title: "Hồ sơ cá nhân", url: "/dashboard/profile" }],
        },
        {
            title: "Danh mục",
            url: "/dashboard/categories",
            icon: BookOpen,
            items: [
                { title: "Loại tài sản", url: "/dashboard/categories/types" },
                { title: "Vị trí / Kho", url: "/dashboard/categories/locations" },
                { title: "Nhà cung cấp", url: "/dashboard/categories/suppliers" },
            ],
        },
        {
            title: "Tài sản",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                { title: "Danh sách tài sản", url: "/dashboard/assets" },
                { title: "Thêm mới", url: "/dashboard/assets/new" },
                { title: "Nhập theo lô", url: "/dashboard/assets/import" },
            ],
        },
        {
            title: "Nghiệp vụ",
            url: "#",
            icon: ArrowRightLeft,
            items: [
                { title: "Điều chuyển", url: "/dashboard/assets/transfer" },
                { title: "Bảo trì & Sửa chữa", url: "/dashboard/assets/maintenance" },
                { title: "Kiểm kê", url: "/dashboard/assets/audit" },
                { title: "Thanh lý", url: "/dashboard/assets/liquidation" },
                { title: "Tính khấu hao", url: "/dashboard/assets/depreciation" },
            ],
        },
        {
            title: "Báo cáo",
            url: "/dashboard/reports",
            icon: PieChart,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const currentUser = useAppStore((state: AppState) => state.currentUser);

    // Filter navigation based on role
    const filteredNavMain = data.navMain.filter((item) => {
        // Admin sees everything
        if (currentUser?.role === "ADMIN") return true;

        if (currentUser?.role === "MANAGER") {
            // Manager doesn't see "Quản trị hệ thống"
            if (item.title === "Quản trị hệ thống") return false;
            return true;
        }

        if (currentUser?.role === "USER") {
            // User only sees "Quản lý tài sản" (Personal Profile) and maybe "Tài sản" (View list)
            // For now, let's limit User to specific modules
            const allowedTitles = ["Tổng quan", "Quản lý tài sản", "Tài sản"];
            return allowedTitles.includes(item.title);
        }

        return false; // Not logged in or unknown role
    });

    // User data for NavUser
    const userData = currentUser
        ? {
              name: currentUser.name,
              email: currentUser.email,
              avatar: currentUser.avatar || "/avatars/shadcn.jpg",
          }
        : data.user;

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={filteredNavMain} />
                {/* <NavProjects projects={data.projects} /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
