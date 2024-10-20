import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { FileUpload } from "@/components/ui/file-upload";
import { useCreateDocument } from "@/api/useDocuments";

const Dashboard: React.FC = () => {
  const addDocument = useCreateDocument();

  const { user } = useAuth();
  const handleFileUpload = (files: File[]) => {
    if (files.length) {
      addDocument.mutate(files);
    }
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
