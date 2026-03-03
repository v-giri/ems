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
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string;
    dueDate: string | null;
    user: {
        name: string | null;
        email: string | null;
    };
}

interface Employee {
    id: string;
    name: string | null;
    email: string | null;
}

export default function AdminTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        userId: "",
        title: "",
        description: "",
        dueDate: "",
    });

    const fetchData = async () => {
        try {
            const [tasksRes, empRes] = await Promise.all([
                fetch("/api/admin/tasks"),
                fetch("/api/employees"),
            ]);

            if (!tasksRes.ok || !empRes.ok) throw new Error("Failed to fetch data");

            const tasksData = await tasksRes.json();
            const empData = await empRes.json();

            setTasks(tasksData);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/admin/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to assign task");

            toast.success("Task assigned successfully");
            setIsFormOpen(false);
            setFormData({ userId: "", title: "", description: "", dueDate: "" });
            fetchData();
        } catch (error) {
            toast.error("Failed to assign task");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            const res = await fetch(`/api/admin/tasks?id=${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete task");

            toast.success("Task deleted");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Manage Tasks</h1>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Assign Task
                </Button>
            </div>

            <div className="rounded-md border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Due Date</TableHead>
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
                        ) : tasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No tasks found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell className="font-medium">
                                        {task.user.name || task.user.email}
                                    </TableCell>
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell>
                                        {task.dueDate ? format(new Date(task.dueDate), "MMM dd, yyyy") : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm border px-2 py-1 rounded-md">{task.status.replace("_", " ")}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(task.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
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
                        <DialogTitle>Assign Task</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Employee</Label>
                            <Select
                                value={formData.userId}
                                onValueChange={(value) => setFormData({ ...formData, userId: value })}
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
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                required
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Assigning..." : "Assign Task"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
