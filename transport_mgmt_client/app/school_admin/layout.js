import { SidebarProvider } from "@/components/ui/sidebar";
import { SchoolAdminSidebar } from "./_components/school-bar-sidebar";
import { SiteHeader } from "./_components/site-header";

export default function SchoolAdminLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen overflow-x-hidden bg-background/60">
        <SchoolAdminSidebar />
        <div className="relative w-full flex min-h-dvh flex-col bg-background">
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
