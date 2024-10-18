"use client";
import { ReactNode, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar/sidebar";
import {
  IconBrandTabler,
  IconSettings,
  IconFile3d,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";
import { auth } from "@/firebase";
import { ThemeToggle } from "./ToggleTheme";
import { Button } from "./ui/button";

export function SidebarWrapper({ children }: { children: ReactNode }) {
  const links = [
    {
      label: "Insights",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Files",
      href: "#",
      icon: (
        <IconFile3d className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
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
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <>
              <Logo />
            </>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <div className={open ? "space-x-2" : "space-y-2"}>
              <ThemeToggle />
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOutIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
              </Button>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img
        src="logo-small.png"
        alt="Logo"
        className="text-2xl font-bold"
        width={60}
        height={40}
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Paiperless
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img
        src="src/assets/logo.png"
        alt="Logo"
        className="text-2xl font-bold"
        width={120}
        height={40}
      />
    </Link>
  );
};
