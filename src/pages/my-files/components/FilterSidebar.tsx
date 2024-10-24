import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useFileManager } from "@/context/useFileManager";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface FilterSidebar {
  filterModalOpen: boolean;
  handleFilterModalClose: () => void;
}

export const FilterSidebar = ({
  filterModalOpen,
  handleFilterModalClose,
}: FilterSidebar) => {
  const {
    categories,
    openCategories,
    toggleCategory,
    activeFilters,
    handleFilterChange,
  } = useFileManager();

  const isMobile = useIsMobile();

  const SidebarFilterContainer = () => (
    <ScrollArea className="h-[calc(100vh-8rem)]">
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
              <div key={subcategory} className="flex items-center p-2">
                <Checkbox
                  id={`filter-${subcategory}`}
                  checked={activeFilters.includes(subcategory)}
                  onCheckedChange={() => handleFilterChange(subcategory)}
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
  );

  if (isMobile) {
    return (
      <Drawer open={filterModalOpen} onClose={handleFilterModalClose}>
        <DrawerContent className="p-4">
          <SidebarFilterContainer />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <SidebarFilterContainer />
      </CardContent>
    </Card>
  );
};
