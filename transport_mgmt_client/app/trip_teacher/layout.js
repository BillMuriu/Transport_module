import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TripTeacherSidebar } from "@/components/ui/trip_teacher/trip-teacher-sidebar";
import { SiteHeader } from "@/components/header";

export default function TripTeacherLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen overflow-x-hidden bg-transparent">
        <TripTeacherSidebar />
        <div className="relative w-full flex min-h-dvh flex-col bg-background">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          {/* <main className="flex-1 overflow-y-auto">{children}</main> */}
        </div>
      </div>
    </SidebarProvider>
  );
}
