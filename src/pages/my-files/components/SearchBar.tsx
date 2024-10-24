import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFileManager } from "@/context/useFileManager";

export const SearchBar: React.FC = () => {
  const { searchQuery, handleSearchChange } = useFileManager();

  return (
    <div className="relative flex-grow">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        type="search"
        placeholder="Search files..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="pl-8 w-full"
      />
    </div>
  );
};
