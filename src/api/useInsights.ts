import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINT, APP_ROUTES } from "./constants";

interface InsightResponse {
  message: string;
  id: string;
}

export const useCreateInsight = (documentId: string) => {
  const toast = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<InsightResponse, Error, void>({
    mutationFn: async () => {
      if (!user) {
        throw new Error("User is not authenticated");
      }

      const token = await user.getIdToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      try {
        const response = await fetch(
          `${API_ENDPOINT}/${APP_ROUTES.INSIGHTS}?documentId=${documentId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create insight");
        }

        return response.json();
      } catch {
        toast.toast({
          description: "Failed to create insight. Please try again.",
          variant: "destructive",
        });
      }
    },
    onSuccess: (data) => {
      toast.toast({
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["insights", documentId] });
    },
    onError: (error: Error) => {
      toast.toast({
        description: `Failed to create insight. Please try again. ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useGetInsights = (documentId: string) => {
  const { user } = useAuth();
  return useQuery<InsightResponse[], Error>({
    queryKey: ["insights", documentId],
    queryFn: async () => {
      if (!user) {
        throw new Error("User is not authenticated");
      }

      const token = await user.getIdToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `${API_ENDPOINT}/${APP_ROUTES.INSIGHTS}?documentId=${documentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }

      return response.json();
    },
  });
};
