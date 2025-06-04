import { SidebarProvider } from "@/components/ui/sidebar";
import { SchoolAdminSidebar } from "./_components/school-bar-sidebar";
import { SiteHeader } from "./_components/site-header";

export default function SchoolAdminLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen overflow-x-hidden bg-background/60">
        {/* <div className="flex min-h-screen w-screen bg-background/60 overflow-x-hidden"></div> */}
        <SchoolAdminSidebar />
        <div className="relative w-full flex min-h-dvh flex-col bg-background">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          {/* <main className="flex-1 overflow-y-auto">{children}</main> */}
        </div>
      </div>
    </SidebarProvider>
  );
}
