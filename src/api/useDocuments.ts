import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINT, SUB_API_ENDPOINTS } from "./constants";

interface UploadResponse {
  message: string;
  fileUrl: string;
}

export const useCreateDocument = () => {
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
        const response = await fetch(
          `${API_ENDPOINT}/${SUB_API_ENDPOINTS.DOCUMENT}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

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

export const useGetDocuments = () => {
  const { user } = useAuth();
  return useQuery<UploadResponse[], Error>({
    queryKey: ["userFiles"],
    queryFn: async () => {
      if (!user) {
        throw new Error("User is not authenticated");
      }

      const token = await user.getIdToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `${API_ENDPOINT}/${SUB_API_ENDPOINTS.DOCUMENT}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      return response.json();
    },
  });
};
