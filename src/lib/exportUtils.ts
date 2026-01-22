import * as XLSX from "xlsx";

/**
 * Export data to Excel file
 * @param data - Array of objects to export
 * @param filename - Name of the Excel file (without extension)
 * @param sheetName - Name of the worksheet
 */
export function exportToExcel<T extends Record<string, any>>(data: T[], filename: string, sheetName: string = "Sheet1"): void {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Format asset data for Excel export
 */
export function formatAssetsForExport(assets: any[]) {
    return assets.map((asset) => ({
        "Mã tài sản": asset.code,
        "Tên tài sản": asset.name,
        "Nguyên giá": asset.price,
        "Ngày mua": asset.purchaseDate,
        "Trạng thái": asset.status,
        "Vị trí": asset.location,
    }));
}

/**
 * Format categories for Excel export
 */
export function formatCategoriesForExport(categories: any[]) {
    return categories.map((cat) => ({
        "Mã danh mục": cat.code,
        "Tên danh mục": cat.name,
        "Mô tả": cat.description || "",
    }));
}

/**
 * Format suppliers for Excel export
 */
export function formatSuppliersForExport(suppliers: any[]) {
    return suppliers.map((sup) => ({
        "Mã NCC": sup.code,
        "Tên NCC": sup.name,
        "Người liên hệ": sup.contactPerson || "",
        "Số điện thoại": sup.phone || "",
        Email: sup.email || "",
        "Địa chỉ": sup.address || "",
    }));
}

/**
 * Format locations for Excel export
 */
export function formatLocationsForExport(locations: any[]) {
    return locations.map((loc) => ({
        "Mã vị trí": loc.code,
        "Tên vị trí": loc.name,
    }));
}

/**
 * Format system logs for Excel export
 */
export function formatLogsForExport(logs: any[]) {
    return logs.map((log) => ({
        "Thời gian": new Date(log.timestamp).toLocaleString("vi-VN"),
        "Hành động": log.action,
        "Người dùng": log.userName,
        "Chi tiết": log.details,
        "Mức độ": log.severity,
    }));
}
