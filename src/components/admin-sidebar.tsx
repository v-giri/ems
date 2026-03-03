"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    CheckSquare,
    Banknote,
    FileText,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Employees", href: "/admin/employees", icon: Users },
    { name: "Leave Requests", href: "/admin/leaves", icon: CalendarDays },
    { name: "Tasks", href: "/admin/tasks", icon: CheckSquare },
    { name: "Payroll", href: "/admin/payroll", icon: Banknote },
    { name: "Documents", href: "/admin/documents", icon: FileText },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-muted/40 p-4">
            <div className="mb-8 flex h-14 items-center px-4 font-bold text-xl tracking-tight">
                EMS Admin
            </div>
            <nav className="flex-1 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href}>
                            <span
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted transition-all",
                                    isActive ? "bg-muted text-primary" : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>
            <div className="mt-auto">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
