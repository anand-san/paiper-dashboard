export interface File {
  id: string;
  name: string;
  url: string;
  fileType: string;
  uploadedAt: string;
  text: string;
  category: string;
  subCategory: string;
  summary: string;
  tags: string[];
  year: number;
}

export interface Category {
  name: string;
  subcategories: string[];
}
