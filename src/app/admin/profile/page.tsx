"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Mail, Building, Banknote, BadgeCheck, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Profile {
    id: string;
    employeeId: string | null;
    name: string | null;
    email: string | null;
    role: string;
    department: string | null;
    salary: number | null;
    cvUrl: string | null;
    createdAt: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/profile");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setProfile(data);
                setNameInput(data.name || "");
            } catch (error) {
                toast.error("Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nameInput }),
            });
            if (!res.ok) throw new Error("Failed to update");
            const data = await res.json();
            setProfile({ ...profile!, ...data });
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <Card><CardContent className="h-48 animate-pulse bg-muted/50" /></Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCircle className="h-10 w-10 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">{profile?.name || "No Name"}</CardTitle>
                            <p className="text-sm text-muted-foreground capitalize">{profile?.role?.toLowerCase()}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Name (editable) */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2"><UserCircle className="h-4 w-4" /> Full Name</Label>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <Input value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
                                <Button onClick={handleSave} disabled={isSaving} size="sm">
                                    {isSaving ? "Saving..." : "Save"}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => { setIsEditing(false); setNameInput(profile?.name || ""); }}>
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <p className="text-sm">{profile?.name || "—"}</p>
                                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
                            </div>
                        )}
                    </div>

                    {/* Read-only fields */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {profile?.employeeId && (
                            <div className="space-y-1">
                                <Label className="flex items-center gap-2 text-muted-foreground"><BadgeCheck className="h-4 w-4" /> Employee ID</Label>
                                <p className="text-sm font-mono">{profile.employeeId}</p>
                            </div>
                        )}
                        <div className="space-y-1">
                            <Label className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> Email</Label>
                            <p className="text-sm">{profile?.email || "—"}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="flex items-center gap-2 text-muted-foreground"><Building className="h-4 w-4" /> Department</Label>
                            <p className="text-sm">{profile?.department || "—"}</p>
                        </div>
                        {profile?.role === "EMPLOYEE" && (
                            <div className="space-y-1">
                                <Label className="flex items-center gap-2 text-muted-foreground"><Banknote className="h-4 w-4" /> Salary</Label>
                                <p className="text-sm">₹{profile?.salary?.toLocaleString('en-IN') || "—"}</p>
                            </div>
                        )}
                        <div className="space-y-1">
                            <Label className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="h-4 w-4" /> Joined</Label>
                            <p className="text-sm">{profile?.createdAt ? format(new Date(profile.createdAt), "MMM dd, yyyy") : "—"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
