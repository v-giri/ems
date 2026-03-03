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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus, Trash2, FileText, Download } from "lucide-react";
import { UploadDropzone } from "@/utils/uploadthing";

interface Document {
    id: string;
    fileName: string;
    fileUrl: string;
    createdAt: string;
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

export default function AdminDocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

    const fetchData = async () => {
        try {
            const [docsRes, empRes] = await Promise.all([
                fetch("/api/admin/documents"),
                fetch("/api/employees"),
            ]);

            if (!docsRes.ok || !empRes.ok) throw new Error("Failed to fetch data");

            const docsData = await docsRes.json();
            const empData = await empRes.json();

            setDocuments(docsData);
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

    const handleUploadComplete = async (res: any[]) => {
        if (!res || res.length === 0) return;

        try {
            const { url, name } = res[0];

            const saveRes = await fetch("/api/admin/documents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedEmployeeId,
                    fileName: name,
                    fileUrl: url,
                }),
            });

            if (!saveRes.ok) throw new Error("Failed to save document metadata");

            toast.success("Document uploaded successfully");
            setIsFormOpen(false);
            setSelectedEmployeeId("");
            fetchData();
        } catch (error) {
            toast.error("Failed to save document");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this document from the portal?")) return;

        try {
            const res = await fetch(`/api/admin/documents?id=${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete document");

            toast.success("Document removed");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete document");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Manage Documents</h1>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Upload Document
                </Button>
            </div>

            <div className="rounded-md border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>File Name</TableHead>
                            <TableHead>Uploaded On</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : documents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No documents found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            documents.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-medium">
                                        {doc.user.name || doc.user.email}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {doc.fileName}
                                            </a>
                                        </div>
                                    </TableCell>
                                    <TableCell>{format(new Date(doc.createdAt), "MMM dd, yyyy")}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" asChild>
                                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" download>
                                                <Download className="h-4 w-4 text-primary" />
                                            </a>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(doc.id)}
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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Upload Document for Employee</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Select Employee</Label>
                            <Select
                                value={selectedEmployeeId}
                                onValueChange={setSelectedEmployeeId}
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

                        {selectedEmployeeId && (
                            <div className="pt-4">
                                <UploadDropzone
                                    endpoint="documentUploader"
                                    onClientUploadComplete={handleUploadComplete}
                                    onUploadError={(error: Error) => {
                                        toast.error(`ERROR! ${error.message}`);
                                    }}
                                    className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50"
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
