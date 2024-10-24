export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export const APP_ROUTES = {
  DOCUMENT: "documents",
  USER: "user",
  INSIGHTS: "insights",
  INTEGRATIONS: "integrations",
};

export const INTEGRATIONS_ROUTES = {
  GOOGLE: "google",
  INSTALLED: "installed",
};

export const GOOGLE_INTEGRATION_ROUTES = {
  SETUP: "setup",
  LIST_DRIVE_FILES: "listDriveFiles",
  LIST_DRIVE_FOLDERS: "listDriveFolders",
  READ_DRIVE_FILE: "readDriveFile",
  PROCESS_DRIVE_FILE: "processDriveFile",
};
