import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="min-w-0 flex-1 pt-6 px-4 pb-12">{children}</main>
    </div>
  )
}
