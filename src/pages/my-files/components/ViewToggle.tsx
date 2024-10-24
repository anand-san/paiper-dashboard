import React from "react";
import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFileManager } from "@/context/useFileManager";

export const ViewToggle: React.FC = () => {
  const { selectedView, handleViewChange } = useFileManager();

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => handleViewChange("grid")}
        variant={selectedView === "grid" ? "default" : "outline"}
        size="icon"
      >
        <Grid className="h-4 w-4" />
        <span className="sr-only">Grid view</span>
      </Button>
      <Button
        onClick={() => handleViewChange("list")}
        variant={selectedView === "list" ? "default" : "outline"}
        size="icon"
      >
        <List className="h-4 w-4" />
        <span className="sr-only">List view</span>
      </Button>
    </div>
  );
};
