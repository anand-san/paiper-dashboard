import { Sidebar } from "@/components/Sidebar";
import Dashboard from "./Dashboard";

export default function Layout() {
  return (
    <main className="min-h-screen w-full flex">
      <Sidebar />
      <Dashboard />
    </main>
  );
}
