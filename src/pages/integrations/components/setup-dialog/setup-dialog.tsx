import { Integration } from "../../integration.types";
import { useState } from "react";
import {
  DriveFile,
  useListDriveFiles,
  useProcessDriveFiles,
  useSetupGoogleIntegration,
} from "@/api/useGoogleIntegration";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import DesktopSetupDialog from "./desktop-dialog";
import { renderStepContent } from "./getStepsContent";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileSetupDrawer from "./mobile-drawer";
import confetti from "canvas-confetti";

export interface SetupDialogProps {
  isSetupOpen: boolean;
  setIsSetupOpen: (open: boolean) => void;
  activeIntegration: Integration;
}

export default function SetupDialog({
  isSetupOpen,
  setIsSetupOpen,
  activeIntegration,
}: SetupDialogProps) {
  const [setupStep, setSetupStep] = useState(1);
  const [isIntegrating, setIsIntegrating] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<DriveFile[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const { toast } = useToast();
  const saveGoogleToken = useSetupGoogleIntegration();
  const { mutateAsync: listDriveFiles } = useListDriveFiles();
  const { mutateAsync: processDriveFiles } = useProcessDriveFiles();

  const triggerFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

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
        triggerFireworks();
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

  const stepContent = renderStepContent({
    activeIntegration,
    step: setupStep,
    isProcessingFiles,
    driveFiles,
    selectedFiles,
    handleFileSelect,
  }) || { header: <></>, body: <></> };

  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <MobileSetupDrawer
        activeIntegration={activeIntegration}
        isSetupOpen={isSetupOpen}
        setIsSetupOpen={setIsSetupOpen}
        stepContent={stepContent}
        setupStep={setupStep}
        handleNextStep={handleNextStep}
        isProcessingFiles={isProcessingFiles}
        isIntegrating={isIntegrating}
      />
    );
  }
  return (
    <DesktopSetupDialog
      activeIntegration={activeIntegration}
      isSetupOpen={isSetupOpen}
      setIsSetupOpen={setIsSetupOpen}
      stepContent={stepContent}
      setupStep={setupStep}
      handleNextStep={handleNextStep}
      isProcessingFiles={isProcessingFiles}
      isIntegrating={isIntegrating}
    />
  );
}
