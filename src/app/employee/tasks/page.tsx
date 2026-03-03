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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    dueDate: string | null;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const res = await fetch("/api/employee/tasks");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setTasks(data);
        } catch (error) {
            toast.error("Failed to load tasks");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const updateTaskStatus = async (taskId: string, newStatus: string) => {
        try {
            const res = await fetch("/api/employee/tasks", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskId, status: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update task");

            toast.success("Task updated");
            fetchTasks();
        } catch (error) {
            toast.error("Failed to update task status");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>

            <div className="rounded-md border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Due Date</TableHead>
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
                        ) : tasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No tasks assigned.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell className="font-medium">{task.title}</TableCell>
                                    <TableCell className="max-w-[300px] truncate" title={task.description || ""}>
                                        {task.description || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {task.dueDate ? format(new Date(task.dueDate), "MMM dd, yyyy") : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={task.status}
                                            onValueChange={(value) => updateTaskStatus(task.id, value)}
                                        >
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="TODO">To Do</SelectItem>
                                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                <SelectItem value="DONE">Done</SelectItem>
                                            </SelectContent>
                                        </Select>
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
