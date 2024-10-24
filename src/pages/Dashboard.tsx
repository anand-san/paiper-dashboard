"use client";

import { useState } from "react";
import {
  // Search,
  FileText,
  FolderOpen,
  HardDrive,
  Eye,
  Trash2,
  Upload,
  BarChart2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCreateDocument, useGetDocuments } from "@/api/useDocuments";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import Loader from "@/components/loader/Loader";

export default function DocumentManagerDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const { user } = useAuth();
  const { data, isPending, isError, error } = useGetDocuments();
  const documents = data?.message;
  const addDocument = useCreateDocument();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      toast({ description: "Starting upload" });
      // Here you would typically send the file to your server
      await addDocument.mutate([file]);

      // Reset the file input
      setFile(null);
    }
  };

  // Calculate quick stats from documents
  const totalDocuments = documents?.length || 0;
  const addedThisMonth =
    documents?.filter(
      (doc) => new Date(doc.uploadedAt).getMonth() === new Date().getMonth()
    ).length || 0;
  const totalCategories =
    new Set(documents?.map((doc) => doc.category)).size || 0;

  const quickStats = [
    {
      title: "Total Documents",
      value: totalDocuments.toString(),
      icon: FileText,
    },
    {
      title: "Added this Month",
      value: addedThisMonth.toString(),
      icon: FileText,
    },
    {
      title: "Total Categories",
      value: totalCategories.toString(),
      icon: FolderOpen,
    },
    {
      title: "Quota Used",
      value: `${totalDocuments.toString()}/500`,
      icon: HardDrive,
    }, // You might want to calculate this if you have file size information
  ];

  // Group documents by category for insights
  const categoryInsights = documents?.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = { count: 0, lastUploaded: new Date(0) };
    }
    acc[doc.category].count++;
    const uploadDate = new Date(doc.uploadedAt);
    if (uploadDate > acc[doc.category].lastUploaded) {
      acc[doc.category].lastUploaded = uploadDate;
    }
    return acc;
  }, {} as Record<string, { count: number; lastUploaded: Date }>);

  const formattedCategoryInsights = Object.entries(categoryInsights || {}).map(
    ([category, data]) => ({
      category,
      count: data.count,
      lastUploaded: data.lastUploaded.toDateString(),
    })
  );
  const recentDocuments = documents
    ?.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            Welcome back{user?.displayName && `, ${user.displayName}`}!
          </h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button size={isMobile ? "icon" : "default"}>
                <Upload className="h-4 w-4" />
                {!isMobile && "Upload New File"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New File</DialogTitle>
                <DialogDescription>
                  Choose a file to upload to your document manager.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">
                    File
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    className="col-span-3"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <Button onClick={handleUpload} disabled={!file}>
                Upload
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-4 w-4" />
              Document Category Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Document Count</TableHead>
                  <TableHead>Last Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formattedCategoryInsights.map((insight, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {insight.category}
                    </TableCell>
                    <TableCell>{insight.count}</TableCell>
                    <TableCell>{insight.lastUploaded}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Uploaded At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDocuments?.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.category}</TableCell>
                    <TableCell>
                      {new Date(doc.uploadedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
