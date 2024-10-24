import React from "react";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFileManager } from "@/context/useFileManager";

export const FileList: React.FC = () => {
  const { selectedView, filteredFiles, selectedFiles, handleFileSelection } =
    useFileManager();

  return (
    <div
      className={`grid ${
        selectedView === "grid"
          ? "grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-col-3 gap-4"
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
            <p className="text-sm text-muted-foreground mb-2">{file.summary}</p>
            <div className="text-sm text-muted-foreground">
              {file.fileType} • Added{" "}
              {format(new Date(file.uploadedAt), "MMM d, yyyy")}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              <Badge>{file.category}</Badge>
              <Badge variant="secondary">{file.subCategory}</Badge>
              {file.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
