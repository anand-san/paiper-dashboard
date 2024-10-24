import React from "react";
import { Badge } from "@/components/ui/badge";
import { useFileManager } from "@/context/useFileManager";

export const ActiveFilters: React.FC = () => {
  const { activeFilters, handleFilterChange } = useFileManager();

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {activeFilters.map((filter) => (
        <Badge key={filter} variant="secondary" className="px-2 py-1">
          {filter}
          <button className="ml-1" onClick={() => handleFilterChange(filter)}>
            ×
          </button>
        </Badge>
      ))}
    </div>
  );
};
