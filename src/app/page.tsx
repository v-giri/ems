import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import {
  Building2,
  Users,
  CalendarCheck,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "ADMIN") {
    redirect("/admin");
  } else if (session?.user?.role === "EMPLOYEE") {
    redirect("/employee");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">EMS Portal</span>
        </div>
        <div>
          <Link href="/login">
            <Button variant="default" className="font-semibold shadow-sm rounded-full px-6">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center text-center px-4 pt-24 pb-32 bg-white relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] rounded-full bg-indigo-100/50 blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            Version 1.0 is now live
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Workforce management, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              simplified.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
            Elevate your organization with a complete suite of tools. From real-time attendance tracking to seamless payroll processing and secure document management.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-lg shadow-blue-500/20 rounded-full group transition-all hover:scale-105">
                Access Dashboard
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Dashboard Mockup built with CSS */}
          <div className="w-full max-w-4xl relative rounded-2xl p-2 bg-slate-900/5 shadow-2xl ring-1 ring-slate-900/10 backdrop-blur">
            <div className="rounded-xl overflow-hidden bg-white ring-1 ring-slate-200 shadow-inner flex flex-col h-[400px]">
              {/* Window Bar */}
              <div className="bg-slate-50 border-b px-4 py-3 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="h-4 w-32 bg-slate-200/60 rounded-full"></div>
                <div className="w-12"></div>
              </div>
              {/* Fake UI */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-48 border-r bg-slate-50/50 p-4 flex flex-col gap-3">
                  <div className="h-8 rounded-md bg-slate-200/50 w-full mb-4"></div>
                  <div className="h-4 rounded bg-slate-200/50 w-3/4"></div>
                  <div className="h-4 rounded bg-slate-200/50 w-full"></div>
                  <div className="h-4 rounded bg-slate-200/50 w-5/6"></div>
                  <div className="h-4 rounded bg-blue-100 w-4/5 mt-2"></div>
                </div>
                {/* Main Content */}
                <div className="flex-1 p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <div className="h-6 rounded bg-slate-200/80 w-48"></div>
                    <div className="h-8 rounded-full bg-slate-200/50 w-8"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 rounded-xl bg-blue-50 border border-blue-100 p-4">
                      <div className="h-4 rounded bg-blue-200/50 w-1/2 mb-3"></div>
                      <div className="h-8 rounded bg-blue-200 w-3/4"></div>
                    </div>
                    <div className="h-24 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                      <div className="h-4 rounded bg-emerald-200/50 w-1/2 mb-3"></div>
                      <div className="h-8 rounded bg-emerald-200 w-3/4"></div>
                    </div>
                    <div className="h-24 rounded-xl bg-indigo-50 border border-indigo-100 p-4">
                      <div className="h-4 rounded bg-indigo-200/50 w-1/2 mb-3"></div>
                      <div className="h-8 rounded bg-indigo-200 w-3/4"></div>
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl bg-slate-50 border border-slate-100 p-4">
                    <div className="h-5 rounded bg-slate-200/80 w-32 mb-4"></div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4 items-center">
                          <div className="h-8 w-8 rounded-full bg-slate-200/50"></div>
                          <div className="h-4 rounded bg-slate-200/50 flex-1"></div>
                          <div className="h-4 rounded bg-slate-200/50 w-24"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 relative border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
              Everything you need to run your team
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful tools designed for administrators to oversee operations, and intuitive portals for employees to manage their workday.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Users className="h-6 w-6 text-blue-600" />}
              title="Employee Directory"
              description="Centralized database for all employee records, roles, and departmental information."
              color="blue"
            />
            <FeatureCard
              icon={<CalendarCheck className="h-6 w-6 text-emerald-600" />}
              title="Time & Attendance"
              description="Seamless check-in/out tracking and comprehensive leave management workflows."
              color="emerald"
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6 text-indigo-600" />}
              title="Task & Payroll"
              description="Assign daily tasks, track progress, and generate structured monthly payroll records."
              color="indigo"
            />
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6 text-rose-600" />}
              title="Secure Documents"
              description="Encrypted cloud storage for sensitive employee files, contracts, and handbooks."
              color="rose"
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Built on Enterprise Grade Technology</h2>
          <div className="flex flex-wrap justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2 text-xl font-bold">
              <span className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center text-slate-600 text-sm">N</span> Next.js
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <span className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center text-slate-600 text-sm">P</span> Prisma
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <span className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center text-slate-600 text-sm">T</span> Tailwind
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <span className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center text-slate-600 text-sm">S</span> Shadcn UI
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center border-t border-slate-800">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-primary p-1.5 rounded-md">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">EMS</span>
        </div>
        <p>© {new Date().getFullYear()} Employee Management System. College Project.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
    rose: "bg-rose-50 border-rose-100 text-rose-700",
  };

  return (
    <div className="flex flex-col p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 group cursor-default">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-6 transition-transform group-hover:scale-110 ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
