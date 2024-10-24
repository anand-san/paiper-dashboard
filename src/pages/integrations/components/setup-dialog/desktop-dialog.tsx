import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ChevronRight } from "lucide-react";
import { SetupDialogProps } from "./setup-dialog";
import { commonBodyComponent } from "./getStepsContent";

interface DesktopSetupDialogProps extends SetupDialogProps {
  stepContent: { header: JSX.Element; body: JSX.Element };
  setupStep: number;
  handleNextStep: () => void;
  isIntegrating: boolean;
  isProcessingFiles: boolean;
}

export default function DesktopSetupDialog({
  stepContent,
  activeIntegration,
  setIsSetupOpen,
  isSetupOpen,
  setupStep,
  handleNextStep,
  isProcessingFiles,
  isIntegrating,
}: DesktopSetupDialogProps) {
  return (
    <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{activeIntegration?.name} Integration Setup</DialogTitle>
          <DialogDescription>{stepContent?.header}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {commonBodyComponent(setupStep)}
          {stepContent?.body}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsSetupOpen(false)}>
            Cancel
          </Button>
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
  );
}
