import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// API endpoint - should be moved to an environment variable in production
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

// const ENDPOINTS = {
//   DOCUMENT: "/document",
// };

interface UploadResponse {
  message: string;
  fileUrl: string;
}

export const useFileUpload = () => {
  const toast = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<UploadResponse, Error, File[]>({
    mutationFn: async (file: File[]) => {
      if (!user) {
        throw new Error("User is not authenticated");
      }

      const token = await user.getIdToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const formData = new FormData();
      formData.append("file", file[0]);

      try {
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }

        return response.json();
      } catch {
        toast.toast({
          description: "Failed to upload file. Please try again.",
          variant: "destructive",
        });
      }
    },
    onSuccess: (data) => {
      toast.toast({
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["userFiles"] });
    },
    onError: (error: Error) => {
      toast.toast({
        description: `Failed to upload file. Please try again. ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
