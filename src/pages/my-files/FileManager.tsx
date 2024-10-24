"use client";

import { useGetDocuments } from "@/api/useDocuments";
import Loader from "@/components/loader/Loader";
import { FileManagerProvider } from "@/context/FileManagerProvider";
import { FilterSidebar } from "./components/FilterSidebar";
import { FileList } from "./components/FileList";
import { SearchBar } from "./components/SearchBar";
import { ViewToggle } from "./components/ViewToggle";
import { ActiveFilters } from "./components/ActiveFilters";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function FileManager() {
  const { isPending, isError, error } = useGetDocuments();
  const isMobile = useIsMobile();
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  if (isPending) {
    return (
      <div className="h-screen flex">
        <Loader />
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching documents:", error);
    return <div>Error loading documents. Please try again later.</div>;
  }

  return (
    <FileManagerProvider>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4">
            <FilterSidebar
              filterModalOpen={filterModalOpen}
              handleFilterModalClose={() => setFilterModalOpen(false)}
            />
          </div>
          <div className="w-full md:w-3/4">
            <div className="flex items-center justify-between mb-4 gap-2">
              <SearchBar />
              {isMobile ? (
                <Button
                  size="icon"
                  variant={"outline"}
                  onClick={() => setFilterModalOpen(true)}
                >
                  <FilterIcon className="h-4 w-4" />
                </Button>
              ) : (
                <ViewToggle />
              )}
            </div>
            <ActiveFilters />
            <FileList />
          </div>
        </div>
      </div>
    </FileManagerProvider>
  );
}
