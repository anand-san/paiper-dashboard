import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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

export default function MobileSetupDrawer({
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
    <Drawer open={isSetupOpen} onOpenChange={setIsSetupOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{activeIntegration?.name} Integration Setup</DrawerTitle>
          <DrawerDescription>{stepContent?.header}</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          {commonBodyComponent(setupStep)}
          {stepContent?.body}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" onClick={() => setIsSetupOpen(false)}>
              Cancel
            </Button>
          </DrawerClose>
          <Button
            onClick={handleNextStep}
            disabled={isIntegrating || isProcessingFiles}
          >
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
