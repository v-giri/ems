"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckSquare, CalendarClock, Banknote, LogIn, LogOut as LogOutIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Stats {
    pendingTasks: number;
    completedTasks: number;
    pendingLeaves: number;
    approvedLeaves: number;
    todayAttendance: {
        id: string;
        status: string;
        checkIn: string | null;
        checkOut: string | null;
    } | null;
    latestPayroll: {
        payPeriod: string;
        netAmount: number;
        isPaid: boolean;
    } | null;
}

export default function EmployeeDashboard() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState<Stats | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/employee/stats");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setStats(data);
            } catch (error) {
                toast.error("Failed to load dashboard data");
            } finally {
                setStatsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleAttendance = async (action: "CHECK_IN" | "CHECK_OUT") => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/employee/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to record attendance");
            }

            toast.success(`Successfully ${action === "CHECK_IN" ? "Checked In" : "Checked Out"}`);
            // Refresh stats
            const statsRes = await fetch("/api/employee/stats");
            if (statsRes.ok) {
                setStats(await statsRes.json());
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const hasCheckedIn = !!stats?.todayAttendance?.checkIn;
    const hasCheckedOut = !!stats?.todayAttendance?.checkOut;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {session?.user?.name || "Employee"}!
            </h1>

            {/* Attendance Card */}
            <Card className="border-2 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">Today&apos;s Attendance</CardTitle>
                    <Clock className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        {hasCheckedIn ? (
                            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-green-100 text-green-800">
                                ✅ Checked In at {new Date(stats!.todayAttendance!.checkIn!).toLocaleTimeString('en-IN')}
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600">
                                Not checked in yet
                            </span>
                        )}
                        {hasCheckedOut && (
                            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800">
                                Checked Out at {new Date(stats!.todayAttendance!.checkOut!).toLocaleTimeString('en-IN')}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => handleAttendance("CHECK_IN")}
                            disabled={isLoading || hasCheckedIn}
                            className="flex-1"
                        >
                            <LogIn className="mr-2 h-4 w-4" /> Check In
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => handleAttendance("CHECK_OUT")}
                            disabled={isLoading || !hasCheckedIn || hasCheckedOut}
                            className="flex-1"
                        >
                            <LogOutIcon className="mr-2 h-4 w-4" /> Check Out
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                        <CheckSquare className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats?.pendingTasks ?? 0}</div>
                        <p className="text-xs text-muted-foreground">{stats?.completedTasks ?? 0} completed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
                        <CalendarClock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats?.pendingLeaves ?? 0}</div>
                        <p className="text-xs text-muted-foreground">{stats?.approvedLeaves ?? 0} approved</p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Latest Payslip</CardTitle>
                        <Banknote className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        {stats?.latestPayroll ? (
                            <div>
                                <div className="text-2xl font-bold">₹{stats.latestPayroll.netAmount.toLocaleString('en-IN')}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.latestPayroll.payPeriod} · {stats.latestPayroll.isPaid ? "✅ Paid" : "⏳ Pending"}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No payroll records yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
