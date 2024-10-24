import React, { createContext } from "react";
import { useGetDocuments } from "@/api/useDocuments";
import { Category, File } from "@/pages/my-files/FileManager.types";
import Loader from "@/components/loader/Loader";

interface FileManagerContextType {
  selectedView: string;
  setSelectedView: (view: string) => void;
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  openCategories: string[];
  setOpenCategories: (categories: string[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  filteredFiles: File[];
  handleViewChange: (view: string) => void;
  handleFileSelection: (fileId: string) => void;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (filter: string) => void;
  toggleCategory: (category: string) => void;
}

export const FileManagerContext = createContext<
  FileManagerContextType | undefined
>(undefined);

export const FileManagerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedView, setSelectedView] = React.useState("grid");
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const [openCategories, setOpenCategories] = React.useState<string[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);

  const { isPending, isError, data, error } = useGetDocuments();

  React.useEffect(() => {
    if (data?.message && Array.isArray(data.message)) {
      const files: File[] = data.message;
      const categoryMap = new Map<string, Set<string>>();
      const yearSet = new Set<number>();
      const fileTypeSet = new Set<string>();
      const tagSet = new Set<string>();

      files.forEach((file) => {
        if (!categoryMap.has(file.category)) {
          categoryMap.set(file.category, new Set());
        }
        categoryMap.get(file.category)?.add(file.subCategory);
        yearSet.add(file.year);
        fileTypeSet.add(file.fileType);
        file.tags.forEach((tag) => tagSet.add(tag));
      });

      const newCategories: Category[] = [
        {
          name: "Category",
          subcategories: Array.from(categoryMap.keys()),
        },
        {
          name: "Sub-Category",
          subcategories: Array.from(
            new Set(
              Array.from(categoryMap.values()).flatMap((set) => Array.from(set))
            )
          ),
        },
        {
          name: "Year",
          subcategories: Array.from(yearSet)
            .map(String)
            .sort((a, b) => b.localeCompare(a)),
        },
        {
          name: "File Type",
          subcategories: Array.from(fileTypeSet),
        },
        {
          name: "Tags",
          subcategories: Array.from(tagSet),
        },
      ];

      setCategories(newCategories);
    }
  }, [data]);

  if (isPending)
    return (
      <div className="h-screen flex">
        <Loader />
      </div>
    );

  if (isError) {
    console.error("Error fetching documents:", error);
    return <div>Error loading documents. Please try again later.</div>;
  }

  const files: File[] = Array.isArray(data?.message) ? data.message : [];

  const handleViewChange = (view: string) => {
    setSelectedView(view);
  };

  const handleFileSelection = (fileId: string) => {
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
            file.category.toLowerCase().includes(filter.toLowerCase()) ||
            file.subCategory.toLowerCase().includes(filter.toLowerCase()) ||
            file.year.toString() === filter ||
            file.fileType.toLowerCase().includes(filter.toLowerCase()) ||
            file.tags.some((tag) =>
              tag.toLowerCase().includes(filter.toLowerCase())
            )
        ))
  );

  return (
    <FileManagerContext.Provider
      value={{
        selectedView,
        setSelectedView,
        selectedFiles,
        setSelectedFiles,
        searchQuery,
        setSearchQuery,
        activeFilters,
        setActiveFilters,
        openCategories,
        setOpenCategories,
        categories,
        setCategories,
        filteredFiles,
        handleViewChange,
        handleFileSelection,
        handleSearchChange,
        handleFilterChange,
        toggleCategory,
      }}
    >
      {children}
    </FileManagerContext.Provider>
  );
};
