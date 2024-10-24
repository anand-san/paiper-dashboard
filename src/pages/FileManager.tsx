"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  Grid,
  List,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for demonstration
const files = [
  {
    id: 1,
    name: "Project Proposal.docx",
    type: "document",
    size: "2.5 MB",
    modified: "2023-06-15",
    shared: true,
    summary: "Outline for the new product launch strategy.",
  },
  {
    id: 2,
    name: "Budget Spreadsheet.xlsx",
    type: "spreadsheet",
    size: "1.8 MB",
    modified: "2023-06-14",
    shared: false,
    summary: "Financial projections for Q3 and Q4.",
  },
  {
    id: 3,
    name: "Team Photo.jpg",
    type: "image",
    size: "3.2 MB",
    modified: "2023-06-13",
    shared: true,
    summary: "Group picture from the company retreat.",
  },
  {
    id: 4,
    name: "Presentation.pptx",
    type: "presentation",
    size: "5.7 MB",
    modified: "2023-06-12",
    shared: false,
    summary: "Slides for the upcoming investor meeting.",
  },
  {
    id: 5,
    name: "Meeting Recording.mp4",
    type: "video",
    size: "58.2 MB",
    modified: "2023-06-11",
    shared: false,
    summary: "Video conference with the marketing team.",
  },
];

const categories = [
  {
    name: "File Type",
    subcategories: [
      "Documents",
      "Spreadsheets",
      "Presentations",
      "Images",
      "Videos",
    ],
  },
  {
    name: "Date Modified",
    subcategories: [
      "Today",
      "Yesterday",
      "Last 7 days",
      "Last 30 days",
      "Last 90 days",
    ],
  },
  {
    name: "File Size",
    subcategories: ["Small (<1MB)", "Medium (1-100MB)", "Large (>100MB)"],
  },
  { name: "Shared Status", subcategories: ["Shared", "Not Shared"] },
];

export default function FileManager() {
  const [selectedView, setSelectedView] = React.useState("grid");
  const [selectedFiles, setSelectedFiles] = React.useState<number[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const [openCategories, setOpenCategories] = React.useState<string[]>([]);

  const handleViewChange = (view: string) => {
    setSelectedView(view);
  };

  const handleFileSelection = (fileId: number) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeFilters.length === 0 ||
        activeFilters.some(
          (filter) =>
            file.type.toLowerCase().includes(filter.toLowerCase()) ||
            (filter === "Shared" && file.shared) ||
            (filter === "Not Shared" && !file.shared)
        ))
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <Card>
            <CardContent className="p-4">
              <ScrollArea>
                <h2 className="font-semibold mb-2">Filters</h2>
                {categories.map((category) => (
                  <Collapsible
                    key={category.name}
                    open={openCategories.includes(category.name)}
                    onOpenChange={() => toggleCategory(category.name)}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md">
                      <span>{category.name}</span>
                      {openCategories.includes(category.name) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4">
                      {category.subcategories.map((subcategory) => (
                        <div
                          key={subcategory}
                          className="flex items-center p-2"
                        >
                          <Checkbox
                            id={`filter-${subcategory}`}
                            checked={activeFilters.includes(subcategory)}
                            onCheckedChange={() =>
                              handleFilterChange(subcategory)
                            }
                          />
                          <label
                            htmlFor={`filter-${subcategory}`}
                            className="ml-2 text-sm"
                          >
                            {subcategory}
                          </label>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-3/4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 w-full">
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
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="px-2 py-1">
                {filter}
                <button
                  className="ml-1"
                  onClick={() => handleFilterChange(filter)}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>

          <div
            className={`grid ${
              selectedView === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "grid-cols-1 gap-2"
            }`}
          >
            {filteredFiles.map((file) => (
              <Card
                key={file.id}
                className={`${
                  selectedFiles.includes(file.id) ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Checkbox
                      checked={selectedFiles.includes(file.id)}
                      onCheckedChange={() => handleFileSelection(file.id)}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{file.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {file.summary}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    {file.type} • {file.size} • Modified{" "}
                    {format(new Date(file.modified), "MMM d, yyyy")}
                  </div>
                  {file.shared && <Badge className="mt-2">Shared</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
