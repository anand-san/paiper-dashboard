import { ThemeToggle } from "@/components/ToggleTheme";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase";
import { LogOut } from "lucide-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 shadow-md dark:shadow-md dark:shadow-gray-900">
        <div className="container mx-auto px-4 py-2 flex justify-between">
          <img
            src="src/assets/logo.png"
            alt="Logo"
            className="text-2xl font-bold"
            width={120}
            height={40}
          />
          <div className="space-x-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut />
            </Button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="shadow-md mt-auto">
        <div className="container mx-auto px-4 py-2 text-center">
          Paiperless
        </div>
      </footer>
    </div>
  );
}
