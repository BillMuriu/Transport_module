import { SidebarProvider } from "@/components/ui/sidebar";
import { SchoolAdminSidebar } from "./_components/school-bar-sidebar";
import { SiteHeader } from "@/components/header";

export default function SchoolAdminLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen overflow-x-hidden bg-transparent">
        <SchoolAdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
          <SiteHeader />
          <div className="flex-1 overflow-y-auto bg-background">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
