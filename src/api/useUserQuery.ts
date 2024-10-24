import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINT, APP_ROUTES } from "./constants";

interface UserResponse {
  message: string;
}
export const useGetUsers = () => {
  const { user } = useAuth();
  return useQuery<UserResponse, Error>({
    queryKey: ["users"],
    queryFn: async () => {
      if (!user) {
        throw new Error("User is not authenticated");
      }

      const token = await user.getIdToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`${API_ENDPOINT}/${APP_ROUTES.USER}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return response.json();
    },
  });
};
