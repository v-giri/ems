"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Clock,
    CalendarDays,
    CheckSquare,
    Banknote,
    UserCircle,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/employee", icon: LayoutDashboard },
    { name: "Attendance", href: "/employee/attendance", icon: Clock },
    { name: "Leave Requests", href: "/employee/leaves", icon: CalendarDays },
    { name: "Tasks", href: "/employee/tasks", icon: CheckSquare },
    { name: "Payroll", href: "/employee/payroll", icon: Banknote },
    { name: "My Profile", href: "/employee/profile", icon: UserCircle },
];

export function EmployeeSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-muted/40 p-4">
            <div className="mb-8 flex h-14 items-center px-4 font-bold text-xl tracking-tight">
                EMS Portal
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
