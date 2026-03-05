"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface LeaveRequest {
    id: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    status: string;
    reason: string;
    user: {
        name: string | null;
        email: string | null;
    };
}

const LEAVE_TYPE_LABELS: Record<string, string> = {
    SICK_LEAVE: "Sick Leave",
    CASUAL_LEAVE: "Casual Leave",
    EARNED_LEAVE: "Earned Leave",
};

export default function AdminLeavesPage() {
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLeaves = async () => {
        try {
            const res = await fetch("/api/admin/leaves");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            toast.error("Failed to load leave requests");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const updateLeaveStatus = async (requestId: string, status: "APPROVED" | "REJECTED") => {
        try {
            const res = await fetch("/api/admin/leaves", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId, status }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            toast.success(`Leave request ${status.toLowerCase()}`);
            fetchLeaves();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Manage Leave Requests</h1>

            <div className="rounded-md border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Leave Type</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No leave requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell className="font-medium">
                                        {request.user.name || request.user.email}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                                            {LEAVE_TYPE_LABELS[request.leaveType] || request.leaveType}
                                        </span>
                                    </TableCell>
                                    <TableCell>{format(new Date(request.startDate), "MMM dd, yyyy")}</TableCell>
                                    <TableCell>{format(new Date(request.endDate), "MMM dd, yyyy")}</TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={request.reason}>
                                        {request.reason}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {request.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {request.status === "PENDING" && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 hover:text-green-700"
                                                    onClick={() => updateLeaveStatus(request.id, "APPROVED")}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => updateLeaveStatus(request.id, "REJECTED")}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
