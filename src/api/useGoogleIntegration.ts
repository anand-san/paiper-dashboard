import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINT, SUB_API_ENDPOINTS } from "./constants";

interface DriveSetupResponse {
  message: string;
}

export type DriveFile = {
  mimeType: string;
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
};

interface DriveFilesResponse {
  message: Array<DriveFile>;
}

export const useSetupGoogleIntegration = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<
    DriveSetupResponse,
    Error,
    { token: string; expiry: string; refreshToken: string }
  >({
    mutationFn: async ({ token: googleToken, expiry, refreshToken }) => {
      if (!user) {
        throw new Error("User is not authenticated");
      }

      const token = await user.getIdToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      try {
        const response = await fetch(
          `${API_ENDPOINT}/${SUB_API_ENDPOINTS.GOOGLE}/setup`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              token: googleToken,
              expiry,
              refreshToken,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Could not save credentials");
        }

        return response.json();
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGoogleCreds"] });
    },
    onError: (e: Error) => {
      throw e;
    },
  });
};

export const useListDriveFiles = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<DriveFile[], Error>({
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
          `${API_ENDPOINT}/${SUB_API_ENDPOINTS.GOOGLE}/listDriveFiles`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Could not save credentials");
        }

        const data: DriveFilesResponse = await response.json();
        return data.message;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listDriveFiles"] });
    },
    onError: (e: Error) => {
      throw e;
    },
  });
};

export const useProcessDriveFiles = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<DriveSetupResponse, Error, { fileId: string }>({
    mutationFn: async ({ fileId }) => {
      if (!user) {
        throw new Error("User is not authenticated");
      }

      const token = await user.getIdToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      try {
        const response = await fetch(
          `${API_ENDPOINT}/${SUB_API_ENDPOINTS.GOOGLE}/processDriveFile?fileId=${fileId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Could not save credentials");
        }

        return await response.json();
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userFiles"],
      });
    },
    onError: (e: Error) => {
      throw e;
    },
  });
};
