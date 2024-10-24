import { ScrollArea } from "@/components/ui/scroll-area";
import { Integration } from "../../integration.types";
import { Check, File } from "lucide-react";
import Loader from "@/components/loader/Loader";
import { Checkbox } from "@/components/ui/checkbox";
import { DriveFile } from "@/api/useGoogleIntegration";
import { Link } from "react-router-dom";

interface RenderProps {
  activeIntegration: Integration | null;
  step: number;
  isProcessingFiles: boolean;
  driveFiles: DriveFile[];
  selectedFiles: DriveFile[];
  handleFileSelect: (file: DriveFile) => void;
}

export const renderStepContent = ({
  activeIntegration,
  step,
  isProcessingFiles,
  driveFiles,
  selectedFiles,
  handleFileSelect,
}: RenderProps) => {
  switch (activeIntegration?.name) {
    case "Google Drive":
      return getStepContent({
        activeIntegration,
        step,
        isProcessingFiles,
        driveFiles,
        selectedFiles,
        handleFileSelect,
      });
    default:
      return null;
  }
};

const getStepContent = ({
  activeIntegration,
  step,
  isProcessingFiles,
  driveFiles,
  selectedFiles,
  handleFileSelect,
}: RenderProps) => {
  const integrationName = activeIntegration?.name;
  switch (step) {
    case 1:
      return {
        header: (
          <p>
            Follow the steps below to connect your {integrationName} account.
          </p>
        ),
        body: (
          <p>
            Click the "Connect {">"}" button below to authorize access to your{" "}
            {integrationName} account.
          </p>
        ),
      };
    case 2:
      return {
        header: (
          <p>
            Follow the steps below to connect your {integrationName} account.
          </p>
        ),
        body: (
          <div className="mt-4">
            <p className="mb-4">
              Select the files you want to sync with Paiper from your{" "}
              {integrationName} account. Only PDF and Images are displayed here
              and are supported by Paiper.
            </p>
            {processgoogleDriveFilesComponent(
              isProcessingFiles,
              driveFiles,
              selectedFiles,
              handleFileSelect
            )}
            <p className="mt-4">
              By selecting "Start Processing {">"}" I will process them so taht
              you can access them in Paiper.
            </p>
          </div>
        ),
      };
    case 3:
      return {
        header: (
          <p>
            Your files are processed. They should be visible in{" "}
            <Link to={"/files"}>"My Files"</Link>
          </p>
        ),
        body: <p></p>,
      };
  }
};

export const commonBodyComponent = (setupStep: number) => (
  <div className="flex items-center mb-4">
    {[1, 2, 3].map((step) => (
      <div key={step} className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step <= setupStep
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {step < setupStep ? <Check className="h-5 w-5" /> : step}
        </div>
        {step < 3 && (
          <div
            className={`h-1 w-12 ${
              step < setupStep ? "bg-primary" : "bg-muted"
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

export const processgoogleDriveFilesComponent = (
  isProcessingFiles: boolean,
  driveFiles: DriveFile[],
  selectedFiles: DriveFile[],
  handleFileSelect: (file: DriveFile) => void
) => {
  return isProcessingFiles ? (
    <>
      Processing Files
      <Loader />
    </>
  ) : (
    <>
      <ScrollArea className="h-[300px] border rounded-md p-4">
        {driveFiles.map((file) => (
          <div key={file.id} className="flex items-center space-x-2 py-2">
            <Checkbox
              id={file.id}
              checked={selectedFiles.some((f) => f.id === file.id)}
              onCheckedChange={() => handleFileSelect(file)}
            />
            <label
              htmlFor={file.id}
              className="flex items-center cursor-pointer"
            >
              <File className="h-4 w-4 mr-2" />
              {file.name}
            </label>
          </div>
        ))}
      </ScrollArea>

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Selected Files:</h4>
        <ScrollArea className="h-[200px] border rounded-md p-2">
          {selectedFiles.map((file) => (
            <div key={file.id} className="py-1">
              <File className="h-4 w-4 inline-block mr-2" />
              {file.name}
            </div>
          ))}
        </ScrollArea>
      </div>
    </>
  );
};
