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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus, CheckCircle2 } from "lucide-react";

interface Payroll {
    id: string;
    payPeriod: string;
    netAmount: number;
    isPaid: boolean;
    createdAt: string;
    user: {
        name: string | null;
        email: string | null;
        department: string | null;
    };
}

interface Employee {
    id: string;
    name: string | null;
    email: string | null;
    salary: number;
}

export default function AdminPayrollPage() {
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        userId: "",
        payPeriod: "",
        netAmount: "",
    });

    const fetchData = async () => {
        try {
            const [payrollRes, empRes] = await Promise.all([
                fetch("/api/admin/payroll"),
                fetch("/api/employees"),
            ]);

            if (!payrollRes.ok || !empRes.ok) throw new Error("Failed to fetch data");

            const payrollData = await payrollRes.json();
            const empData = await empRes.json();

            setPayrolls(payrollData);
            setEmployees(empData.filter((emp: any) => emp.role === "EMPLOYEE"));
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEmployeeSelect = (userId: string) => {
        const emp = employees.find(e => e.id === userId);
        setFormData({
            ...formData,
            userId,
            netAmount: emp ? emp.salary.toString() : "", // monthly salary proxy
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/admin/payroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to process payroll");

            toast.success("Payroll processed successfully");
            setIsFormOpen(false);
            setFormData({ userId: "", payPeriod: "", netAmount: "" });
            fetchData();
        } catch (error) {
            toast.error("Failed to process payroll");
        } finally {
            setIsSubmitting(false);
        }
    };

    const markAsPaid = async (payrollId: string) => {
        try {
            const res = await fetch("/api/admin/payroll", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ payrollId, isPaid: true }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            toast.success("Payroll marked as paid");
            fetchData();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Manage Payroll</h1>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Process Payroll
                </Button>
            </div>

            <div className="rounded-md border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Pay Period</TableHead>
                            <TableHead>Net Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
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
                            payrolls.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">
                                        {record.user.name || record.user.email}
                                        <div className="text-xs text-muted-foreground">{record.user.department}</div>
                                    </TableCell>
                                    <TableCell>{record.payPeriod}</TableCell>
                                    <TableCell>${Number(record.netAmount).toLocaleString()}</TableCell>
                                    <TableCell>
                                        {record.isPaid ? (
                                            <span className="inline-flex items-center text-sm font-medium text-green-600">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center text-sm font-medium text-yellow-600">
                                                Pending
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {!record.isPaid && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => markAsPaid(record.id)}
                                            >
                                                <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Paid
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Process Payroll</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Employee</Label>
                            <Select
                                value={formData.userId}
                                onValueChange={handleEmployeeSelect}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map((emp) => (
                                        <SelectItem key={emp.id} value={emp.id}>
                                            {emp.name || emp.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payPeriod">Pay Period (e.g., Oct 2023)</Label>
                            <Input
                                id="payPeriod"
                                required
                                value={formData.payPeriod}
                                onChange={(e) => setFormData({ ...formData, payPeriod: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="netAmount">Net Amount ($)</Label>
                            <Input
                                id="netAmount"
                                type="number"
                                required
                                value={formData.netAmount}
                                onChange={(e) => setFormData({ ...formData, netAmount: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Processing..." : "Process"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
