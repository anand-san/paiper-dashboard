import { useState } from "react";
import { Search, HelpCircle } from "lucide-react";
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
  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false);

  const handleSetup = (integration: Integration) => {
    setActiveIntegration(integration);
    setIsSetupDialogOpen(true);
  };

  const filteredIntegrations = integrations.filter((integration) =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {isSetupDialogOpen && activeIntegration && (
        <SetupDialog
          activeIntegration={activeIntegration}
          isSetupOpen={isSetupDialogOpen}
          setIsSetupOpen={setIsSetupDialogOpen}
        />
      )}
    </div>
  );
}
