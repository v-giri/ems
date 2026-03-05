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
import { Download, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Payroll {
    id: string;
    payPeriod: string;
    netAmount: number;
    isPaid: boolean;
    createdAt: string;
}

export default function PayrollPage() {
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPayroll = async () => {
            try {
                const res = await fetch("/api/employee/payroll");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setPayrolls(data);
            } catch (error) {
                toast.error("Failed to load payroll history");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPayroll();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Payroll History</h1>

            <div className="rounded-md border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pay Period</TableHead>
                            <TableHead>Generated On</TableHead>
                            <TableHead>Net Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : payrolls.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No payroll records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            payrolls.map((payroll) => (
                                <TableRow key={payroll.id}>
                                    <TableCell className="font-medium">{payroll.payPeriod}</TableCell>
                                    <TableCell>{format(new Date(payroll.createdAt), "MMM dd, yyyy")}</TableCell>
                                    <TableCell>₹{payroll.netAmount.toLocaleString('en-IN')}</TableCell>
                                    <TableCell>
                                        {payroll.isPaid ? (
                                            <span className="inline-flex items-center text-sm font-medium text-green-600">
                                                <CheckCircle2 className="mr-1 h-4 w-4" /> Paid
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center text-sm font-medium text-yellow-600">
                                                <Clock className="mr-1 h-4 w-4" /> Pending
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="hidden">
                                            {/* Placeholder for future PDF generation */}
                                            <Download className="mr-2 h-4 w-4" /> Payslip
                                        </Button>
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
