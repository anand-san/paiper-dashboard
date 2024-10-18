import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { FileUpload } from "@/components/ui/file-upload";
import { useFileUpload } from "@/api/useFileUpload";

const Dashboard: React.FC = () => {
  const fileUpload = useFileUpload();

  const { user } = useAuth();
  const handleFileUpload = (files: File[]) => {
    if (files.length) {
      fileUpload.mutate(files);
    }
    console.log(files);
  };

  return (
    <main className="flex justify-center">
      Hello {user?.email}
      <div className="flex items-center mx-auto border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
        <FileUpload onChange={handleFileUpload} />
      </div>
    </main>
  );
};

export default Dashboard;
