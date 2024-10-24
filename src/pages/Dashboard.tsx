"use client";

import { useState } from "react";
import {
  // Bar,
  // BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  // Search,
  FileText,
  FolderOpen,
  HardDrive,
  Eye,
  Edit,
  Trash2,
  Upload,
  BarChart2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
import { useCreateDocument } from "@/api/useDocuments";
import { useToast } from "@/hooks/use-toast";

// Dummy data (unchanged)
const quickStats = [
  { title: "Total Documents", value: "1,234", icon: FileText },
  { title: "Added this Month", value: "56", icon: FileText },
  { title: "Total Categories", value: "8", icon: FolderOpen },
  { title: "Storage Used", value: "45.6 GB", icon: HardDrive },
];

const recentDocuments = [
  {
    id: 1,
    name: "Project Proposal.docx",
    date: "2023-04-01",
    category: "Work",
  },
  {
    id: 2,
    name: "Financial Report Q1.xlsx",
    date: "2023-03-28",
    category: "Finance",
  },
  { id: 3, name: "Meeting Minutes.pdf", date: "2023-03-25", category: "Work" },
  {
    id: 4,
    name: "Product Roadmap.pptx",
    date: "2023-03-22",
    category: "Planning",
  },
  {
    id: 5,
    name: "Customer Feedback.pdf",
    date: "2023-03-20",
    category: "Feedback",
  },
];

const categoryData = [
  { name: "Work", value: 45 },
  { name: "Finance", value: 20 },
  { name: "Personal", value: 15 },
  { name: "Planning", value: 10 },
  { name: "Feedback", value: 10 },
];

const monthlyUploadData = [
  { name: "Nov", uploads: 20 },
  { name: "Dec", uploads: 35 },
  { name: "Jan", uploads: 28 },
  { name: "Feb", uploads: 45 },
  { name: "Mar", uploads: 52 },
  { name: "Apr", uploads: 56 },
];

// New dummy data for insights
const categoryInsights = [
  {
    category: "Work",
    count: 450,
    avgSize: "2.3 MB",
    lastUploaded: "2 hours ago",
  },
  {
    category: "Finance",
    count: 200,
    avgSize: "1.8 MB",
    lastUploaded: "1 day ago",
  },
  {
    category: "Personal",
    count: 150,
    avgSize: "3.5 MB",
    lastUploaded: "3 days ago",
  },
  {
    category: "Planning",
    count: 100,
    avgSize: "4.2 MB",
    lastUploaded: "1 week ago",
  },
  {
    category: "Feedback",
    count: 100,
    avgSize: "1.1 MB",
    lastUploaded: "2 days ago",
  },
];

export default function DocumentManagerDashboard() {
  // const [searchQuery, setSearchQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const addDocument = useCreateDocument();
  const { toast } = useToast();
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Document Manager AI</h1>
          <div className="relative w-1/3">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header> */}

      <main className="flex-grow container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Welcome back, John!</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" /> Upload New File
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>{doc.category}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
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

          <Card>
            <CardHeader>
              <CardTitle>Document Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: "Documents",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="var(--color-value)"
                      label
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Upload Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                uploads: {
                  label: "Uploads",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyUploadData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Line
                    type="monotone"
                    dataKey="uploads"
                    stroke="var(--color-uploads)"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
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
                  <TableHead>Average Size</TableHead>
                  <TableHead>Last Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryInsights.map((insight, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {insight.category}
                    </TableCell>
                    <TableCell>{insight.count}</TableCell>
                    <TableCell>{insight.avgSize}</TableCell>
                    <TableCell>{insight.lastUploaded}</TableCell>
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
