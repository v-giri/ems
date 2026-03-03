"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function EmployeeDashboard() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

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
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {session?.user?.name || "Employee"}!
            </h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button
                            className="w-full"
                            onClick={() => handleAttendance("CHECK_IN")}
                            disabled={isLoading}
                        >
                            Check In
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => handleAttendance("CHECK_OUT")}
                            disabled={isLoading}
                        >
                            Check Out
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
