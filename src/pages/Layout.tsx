import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <main className="min-h-screen w-full flex">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full h-full md:mx-4">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
    </main>
  );
}
