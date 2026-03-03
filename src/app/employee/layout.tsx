import { EmployeeSidebar } from "@/components/employee-sidebar";

export default function EmployeeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <EmployeeSidebar />
            <main className="flex-1 overflow-y-auto bg-muted/20 p-8">
                {children}
            </main>
        </div>
    );
}
