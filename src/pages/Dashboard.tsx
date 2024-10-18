import React, { useState } from "react";
import Layout from "./Layout";
import { useAuth } from "@/hooks/useAuth";
import { FileUpload } from "@/components/ui/file-upload";

const Dashboard: React.FC = () => {
  const [, setFiles] = useState<File[]>([]);

  const { user } = useAuth();
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <Layout>
      <main className="h-screen w-full flex justify-center">
        Hello {user?.email}
        <div className="flex items-center mx-auto border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
          <FileUpload onChange={handleFileUpload} />
        </div>
      </main>
    </Layout>
  );
};

export default Dashboard;
