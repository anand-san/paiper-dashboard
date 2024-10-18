import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  User,
  Menu,
} from "lucide-react";
import { ThemeToggle } from "./ToggleTheme";

// Custom hook to handle mobile check and window resize event
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

interface SidebarContentProps {
  isOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarToggleButton = ({
  isOpen,
  toggleSidebar,
  isMobile,
}: SidebarContentProps) => (
  <Button
    variant="ghost"
    size="icon"
    className={isMobile ? "fixed top-4 left-4 z-20" : ""}
    onClick={toggleSidebar}
  >
    {isMobile ? <Menu /> : isOpen ? <ChevronLeft /> : <ChevronRight />}
  </Button>
);

const SidebarContent = ({
  isOpen,
  isMobile,
  toggleSidebar,
}: SidebarContentProps) => {
  const sidebarVariants = {
    open: {
      width: isMobile ? "100%" : "16rem",
      x: 0,
      // transition: { type: "spring", stiffness: 100 },
    },
    closed: {
      width: isMobile ? "0" : "4rem",
      x: isMobile ? "-100%" : 0,
      // transition: { type: "spring", stiffness: 100 },
    },
  };

  const textVariants = {
    open: {
      opacity: 1,
      x: 0,
      display: "inline-block",
      // transition: { delay: 0.2 },
    },
    closed: {
      opacity: 0,
      x: -20,
      display: "none",
      // transition: { display: { delay: 0.2 } },
    },
  };

  return (
    <motion.div
      className={`${
        isMobile ? "fixed inset-y-0 left-0 z-30 w-full" : "h-screen"
      } bg-gray-800 text-white`}
      initial={isMobile ? "closed" : "open"}
      animate={isOpen ? "open" : "closed"}
      exit="closed"
      variants={sidebarVariants}
    >
      <div className="flex justify-end p-4">
        <SidebarToggleButton
          isOpen={isOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
      </div>
      <nav className="mt-8 ">
        <ul className="space-y-4">
          <div>
            {["Home", "Profile", "Settings"].map((item, index) => (
              <li key={item}>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 hover:bg-gray-700"
                >
                  {index === 0 && <Home className="h-6 w-6 flex-shrink-0" />}
                  {index === 1 && <User className="h-6 w-6 flex-shrink-0" />}
                  {index === 2 && (
                    <Settings className="h-6 w-6 flex-shrink-0" />
                  )}
                  <motion.span
                    className={`ml-3 ${isMobile ? "text-xl" : ""}`}
                    variants={isMobile ? {} : textVariants}
                    initial={isMobile ? { opacity: 1, x: 0 } : "closed"}
                    animate={isOpen || isMobile ? "open" : "closed"}
                  >
                    {item}
                  </motion.span>
                </a>
              </li>
            ))}
          </div>
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </motion.div>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isMobile && (
        <SidebarToggleButton
          isOpen={isOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
      )}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <SidebarContent
            isOpen={isOpen}
            isMobile={isMobile}
            toggleSidebar={toggleSidebar}
          />
        )}
      </AnimatePresence>
      {isMobile && isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export { Sidebar };
