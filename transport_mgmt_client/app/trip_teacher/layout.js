import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TripTeacherSidebar } from "@/components/ui/trip_teacher/trip-teacher-sidebar";
import { SiteHeader } from "@/components/header";

export default function TripTeacherLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen overflow-x-hidden">
        <TripTeacherSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <SiteHeader />
          <div className="flex-1 overflow-y-auto bg-background">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
