import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Layout() {
  const location = useLocation();
  const currentRoute = location.pathname;

  return (
    <main className="min-h-screen w-full">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full h-full m-2 md:m-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <SidebarTrigger />
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link to="/">Home</Link>
              </BreadcrumbItem>
              {currentRoute === "/files" && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <Link to="/files">My Files</Link>
                  </BreadcrumbItem>
                </>
              )}
              {currentRoute === "/profile" && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <Link to="/profile">Profile</Link>
                  </BreadcrumbItem>
                </>
              )}
              {currentRoute === "/integrations" && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <Link to="/integrations">Integrations</Link>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </main>
  );
}
