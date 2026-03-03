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

interface AttendanceRecord {
    id: string;
    date: string;
    checkIn: string | null;
    checkOut: string | null;
    status: string;
}

export default function AttendancePage() {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await fetch("/api/employee/attendance");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setRecords(data);
            } catch (error) {
                toast.error("Failed to load attendance records");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Attendance History</h1>

            <div className="rounded-md border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Check In</TableHead>
                            <TableHead>Check Out</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : records.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No attendance records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">
                                        {format(new Date(record.date), "MMM dd, yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        {record.checkIn ? format(new Date(record.checkIn), "hh:mm a") : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {record.checkOut ? format(new Date(record.checkOut), "hh:mm a") : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${record.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                                                record.status === 'HALF_DAY' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {record.status}
                                        </span>
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
