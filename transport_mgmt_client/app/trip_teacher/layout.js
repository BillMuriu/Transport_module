import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TripTeacherSidebar } from "@/components/ui/trip_teacher/trip-teacher-sidebar";

export default function TripTeacherLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen overflow-x-hidden">
        <TripTeacherSidebar />
        <main className="flex-1">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
