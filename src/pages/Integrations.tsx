import { useState } from "react";
import { Search, HelpCircle, ChevronRight, Check, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import {
  DriveFile,
  useListDriveFiles,
  useProcessDriveFiles,
  useSetupGoogleIntegration,
} from "@/api/useGoogleIntegration";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/loader/Loader";
import { Link } from "react-router-dom";

interface Integration {
  id: number;
  name: string;
  connected: boolean;
  logo: string;
  disabled: boolean;
}

const integrations: Integration[] = [
  {
    id: 1,
    name: "Google Drive",
    logo: "/integrations/gdrive.svg?height=40&width=40",
    connected: false,
    disabled: false,
  },
  {
    id: 2,
    name: "iCloud",
    logo: "/integrations/icloud.svg?height=40&width=40",
    connected: false,
    disabled: true,
  },
  {
    id: 3,
    name: "Dropbox",
    logo: "/integrations/dropbox.svg?height=40&width=40",
    connected: false,
    disabled: true,
  },

  {
    id: 4,
    name: "OneDrive",
    logo: "/integrations/onedrive.svg?height=40&width=40",
    connected: false,
    disabled: true,
  },
  {
    id: 5,
    name: "Box",
    logo: "/integrations/box.svg?height=40&width=40",
    connected: false,
    disabled: true,
  },

  //   {
  //     id: 6,
  //     name: "Amazon S3",
  //     logo: "/integrations/aws.svg?height=40&width=40",
  //     connected: true,
  //     disabled: true,
  //   },
];

export default function IntegrationSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIntegration, setActiveIntegration] =
    useState<Integration | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [isIntegrating, setIsIntegrating] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const filteredIntegrations = integrations.filter((integration) =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [selectedFiles, setSelectedFiles] = useState<DriveFile[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const { toast } = useToast();
  const saveGoogleToken = useSetupGoogleIntegration();
  const { mutateAsync: listDriveFiles } = useListDriveFiles();
  const { mutateAsync: processDriveFiles } = useProcessDriveFiles();

  const handleFileSelect = (file: DriveFile) => {
    setSelectedFiles((prev) =>
      prev.some((f) => f.id === file.id)
        ? prev.filter((f) => f.id !== file.id)
        : [...prev, file]
    );
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    provider.addScope("https://www.googleapis.com/auth/drive");

    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idTokenResult = await user.getIdTokenResult();
    const credential = GoogleAuthProvider.credentialFromResult(result);

    const refreshToken = user.refreshToken;

    return {
      token: credential?.accessToken || "",
      expiry: idTokenResult.expirationTime,
      refreshToken,
    };
  };

  const handleSetup = (integration: Integration) => {
    setActiveIntegration(integration);
    setIsSetupOpen(true);
    setSetupStep(1);
  };

  const handleNextStep = async () => {
    if (setupStep === 1 && activeIntegration?.name === "Google Drive") {
      try {
        setIsIntegrating(true);
        const signInResult = await handleGoogleSignIn();
        if (!signInResult.token) {
          throw new Error("Invalid OAuth token recieved from provider");
        }
        await saveGoogleToken.mutate(signInResult);
        const driveFiles = await listDriveFiles();
        setDriveFiles(driveFiles);
        await setSetupStep(setupStep + 1);
      } catch (error) {
        console.log(error);
        toast({
          description: `Failed to integrate with ${activeIntegration?.name}`,
          variant: "destructive",
        });
      } finally {
        setIsIntegrating(false);
      }

      return;
    }
    if (setupStep === 2 && activeIntegration?.name === "Google Drive") {
      try {
        setIsProcessingFiles(true);
        const promises = selectedFiles.map((file) =>
          processDriveFiles({ fileId: file.id })
        );
        await Promise.all(promises);
        toast({ description: "All files processed successfully" });
      } catch (error) {
        console.log(error);
        toast({
          description: `Failed to process files from ${activeIntegration?.name}`,
          variant: "destructive",
        });
      } finally {
        setIsProcessingFiles(false);
      }
    }
    if (setupStep < 3) {
      setSetupStep(setupStep + 1);
    } else {
      setIsSetupOpen(false);
      setSetupStep(1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Integrations</h1>
      <div className="mb-6">
        <div className="relative max-w-md">
          <Input
            type="text"
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-card text-card-foreground rounded-lg shadow-md p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <img
                  src={integration.logo}
                  alt={`${integration.name} logo`}
                  className="w-10 h-10"
                />
                {integration.connected && (
                  <Badge variant="secondary" className="ml-2">
                    Connected
                  </Badge>
                )}
                {integration.disabled && (
                  <Badge variant="outline" className="ml-2">
                    Unavailable
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{integration.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {integration.disabled
                  ? `${integration.name} integration is currently unavailable or in development.`
                  : `Connect your ${integration.name} account to easily manage and sync your files.`}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <Button
                variant={integration.connected ? "outline" : "default"}
                onClick={() => handleSetup(integration)}
                disabled={integration.disabled}
              >
                {integration.connected ? "Manage" : "Connect"}
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Click to learn more about {integration.name} integration
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeIntegration?.name} Integration Setup
            </DialogTitle>
            <DialogDescription>
              Follow the steps below to connect your {activeIntegration?.name}{" "}
              account.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
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
            <div className="mt-4">
              {setupStep === 1 && (
                <p>
                  Click the button below to authorize access to your{" "}
                  {activeIntegration?.name} account.
                </p>
              )}
              {setupStep === 2 && (
                <div>
                  <p className="mb-4">
                    Select the files you want to sync with Paiper from your{" "}
                    {activeIntegration?.name} account. Only PDF and Images are
                    displayed here and are supported by Paiper.
                  </p>
                  {isProcessingFiles ? (
                    <>
                      Processing Files
                      <Loader />
                    </>
                  ) : (
                    <>
                      <ScrollArea className="h-[200px] border rounded-md p-4">
                        {driveFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center space-x-2 py-2"
                          >
                            <Checkbox
                              id={file.id}
                              checked={selectedFiles.some(
                                (f) => f.id === file.id
                              )}
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
                        <ScrollArea className="h-[100px] border rounded-md p-2">
                          {selectedFiles.map((file) => (
                            <div key={file.id} className="py-1">
                              <File className="h-4 w-4 inline-block mr-2" />
                              {file.name}
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    </>
                  )}
                </div>
              )}
              {setupStep === 3 && (
                <p>
                  Your files are processed. They should be visible in{" "}
                  <Link to={"/files"}>"My Files"</Link>
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            {/* <Button variant="outline" onClick={() => setIsSetupOpen(false)}>
              Cancel
            </Button> */}
            <Button onClick={handleNextStep} disabled={isIntegrating}>
              {isIntegrating ? (
                <>
                  Integrating
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : isProcessingFiles ? (
                <>
                  Processing
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  {setupStep === 1
                    ? "Connect"
                    : setupStep === 3
                    ? "Finish"
                    : "Start Processing"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
