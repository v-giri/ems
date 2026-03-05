"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { EmployeeForm } from "@/components/employee-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Employee {
    id: string;
    employeeId: string | null;
    name: string | null;
    email: string | null;
    department: string | null;
    salary: number | null;
    cvUrl: string | null;
}

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const router = useRouter();

    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/employees");
            if (!res.ok) throw new Error("Failed to fetch employees");
            const data = await res.json();
            setEmployees(data);
        } catch (error) {
            toast.error("Error loading employees");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAdd = () => {
        setEditingEmployee(null);
        setIsFormOpen(true);
    };

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this employee?")) return;

        try {
            const res = await fetch(`/api/employees/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Employee deleted successfully");
            fetchEmployees();
            router.refresh();
        } catch (error) {
            toast.error("Error deleting employee");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Add Employee
                </Button>
            </div>

            <div className="rounded-md border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Emp ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Salary</TableHead>
                            <TableHead>CV</TableHead>
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
                        ) : employees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No employees found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            employees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell className="font-mono text-xs">{employee.employeeId || "—"}</TableCell>
                                    <TableCell className="font-medium">{employee.name || "N/A"}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee.department || "N/A"}</TableCell>
                                    <TableCell>₹{employee.salary?.toLocaleString('en-IN') || "N/A"}</TableCell>
                                    <TableCell>
                                        {employee.cvUrl ? (
                                            <a href={employee.cvUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">View CV</a>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(employee)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => handleDelete(employee.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <EmployeeForm
                employee={editingEmployee}
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSuccess={fetchEmployees}
            />
        </div>
    );
}
