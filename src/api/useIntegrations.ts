import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINT, APP_ROUTES, INTEGRATIONS_ROUTES } from "./constants";
import { Integration } from "@/pages/integrations/integration.types";
import { User } from "firebase/auth";

interface AllIntegrationsResponse {
  message: Integration[];
}

interface InstalledIntegrationsResponse {
  message: [string];
}

const fetchWithAuth = async (url: string, user: User | null) => {
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const token = await user.getIdToken();
  if (!token) {
    throw new Error("No authentication token available");
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};

export const useListAllIntegrations = () => {
  const { user } = useAuth();

  return useQuery<AllIntegrationsResponse, Error>({
    queryKey: ["listAllIntegrations"],
    queryFn: () =>
      fetchWithAuth(`${API_ENDPOINT}/${APP_ROUTES.INTEGRATIONS}`, user),
    enabled: !!user,
  });
};

export const useListInstalledIntegrations = () => {
  const { user } = useAuth();

  return useQuery<InstalledIntegrationsResponse, Error>({
    queryKey: ["listInstalledIntegrations"],
    queryFn: () =>
      fetchWithAuth(
        `${API_ENDPOINT}/${APP_ROUTES.INTEGRATIONS}/${INTEGRATIONS_ROUTES.INSTALLED}`,
        user
      ),
    enabled: !!user,
  });
};
