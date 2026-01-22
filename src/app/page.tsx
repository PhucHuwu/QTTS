"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
    const [email, setEmail] = useState("admin@qtts.com");
    const [error, setError] = useState("");
    const router = useRouter();
    const login = useAppStore((state) => state.login);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Simulate login delay
        setTimeout(() => {
            const success = login(email);
            if (success) {
                router.push("/dashboard");
            } else {
                setError("Email không tồn tại trong hệ thống demo.");
            }
        }, 500);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Terminal className="size-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Đăng nhập QTTS</CardTitle>
                    <CardDescription className="text-center">Hệ thống Quản lý Tài sản (Demo)</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="admin@qtts.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Lỗi</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full">
                            Đăng nhập
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground text-center">
                    <p>Tài khoản demo:</p>
                    <ul className="text-xs space-y-1">
                        <li className="cursor-pointer hover:text-primary" onClick={() => setEmail("admin@qtts.com")}>
                            Admin: admin@qtts.com
                        </li>
                        <li className="cursor-pointer hover:text-primary" onClick={() => setEmail("manager@qtts.com")}>
                            Quản lý: manager@qtts.com
                        </li>
                        <li className="cursor-pointer hover:text-primary" onClick={() => setEmail("user@qtts.com")}>
                            Nhân viên: user@qtts.com
                        </li>
                    </ul>
                </CardFooter>
            </Card>
        </div>
    );
}
