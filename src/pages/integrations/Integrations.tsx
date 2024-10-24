import { useState } from "react";
import { Search, HelpCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Integration } from "./integration.types";
import SetupDialog from "./components/setup-dialog/setup-dialog";
import {
  useListAllIntegrations,
  useListInstalledIntegrations,
} from "@/api/useIntegrations";
import Loader from "@/components/loader/Loader";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function IntegrationSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIntegration, setActiveIntegration] =
    useState<Integration | null>(null);
  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  const { data: allIntegrations, isLoading: allIntegrationsLoading } =
    useListAllIntegrations();
  const {
    data: installedIntegrations,
    isLoading: installedIntegrationsLoading,
  } = useListInstalledIntegrations();

  const allIntegrationsArray = allIntegrations?.message;

  if (allIntegrationsLoading || installedIntegrationsLoading) {
    return <Loader />;
  }

  const filteredIntegrations = allIntegrationsArray?.filter((integration) =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSetup = (integration: Integration) => {
    setActiveIntegration(integration);
    setIsSetupDialogOpen(true);
  };

  const handleRemoveIntegration = () => {
    setIsRemoveDialogOpen(false);
  };

  return (
    <div>
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
        {filteredIntegrations?.map((integration) => (
          <div
            key={integration.id}
            className={cn(
              "bg-card text-card-foreground rounded-lg shadow-md p-6 flex flex-col justify-between",
              integration.disabled && "opacity-50 pointer-events-none"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <img
                  src={integration.logo}
                  alt={`${integration.name} logo`}
                  className="w-10 h-10"
                />
                {installedIntegrations?.message.includes(integration.slug) && (
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
              {installedIntegrations?.message.includes(integration.slug) ? (
                <>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleSetup(integration)}
                    >
                      Re-Sync
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setActiveIntegration(integration);
                        setIsRemoveDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  variant={"default"}
                  onClick={() => handleSetup(integration)}
                  disabled={integration.disabled}
                >
                  Connect
                </Button>
              )}
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
      {isSetupDialogOpen && activeIntegration && (
        <SetupDialog
          activeIntegration={activeIntegration}
          isSetupOpen={isSetupDialogOpen}
          setIsSetupOpen={setIsSetupDialogOpen}
        />
      )}
      {isRemoveDialogOpen && activeIntegration && (
        <AlertDialog
          open={isRemoveDialogOpen}
          onOpenChange={setIsRemoveDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Integration</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove the {activeIntegration?.name}{" "}
                integration? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRemoveIntegration}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
