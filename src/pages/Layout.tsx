import { SidebarWrapper } from "@/components/Sidebar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <SidebarWrapper>{children}</SidebarWrapper>;
}
