import { AppSidebar } from "./_components/app-sidebar";
// import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "./_components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">Sidebar</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
