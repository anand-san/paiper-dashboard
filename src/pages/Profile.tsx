import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreditCard,
  FileText,
  Key,
  Loader,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

export default function UserProfilePage() {
  const [user, setUser] = useState({
    name: "Jane Doe",
    email: "jane@example.com",
    accountType: "Premium",
    profilePicture: "/placeholder.svg?height=100&width=100",
    fileQuotaUsed: 187,
    totalFileQuota: 500,
    recentActivity: [
      {
        action: "Processed Insights",
        item: "Ppresentation.pptx",
        date: "2024-04-01",
      },
      {
        action: "Uploaded file",
        item: "presentation.pptx",
        date: "2023-04-01",
      },
      { action: "Deleted file", item: "old-draft.docx", date: "2024-03-28" },
    ],
  });

  const { user: firebaseUser, loading } = useAuth();

  console.log({ firebaseUser });

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-4">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage
                  src={firebaseUser?.photoURL || ""}
                  alt={user.name}
                />
                <AvatarFallback>
                  {firebaseUser?.displayName ||
                    ""
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{firebaseUser?.displayName}</CardTitle>
              <CardDescription>{user.accountType} Account</CardDescription>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Files
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Shared
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Integrations
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Processing Quota</h3>
                  <Progress
                    value={(user.fileQuotaUsed / user.totalFileQuota) * 100}
                  />
                  <p className="text-sm text-muted-foreground">
                    {user.fileQuotaUsed} of {user.totalFileQuota} files
                    processed
                  </p>
                </div>
                {/* <div>
                  <h3 className="text-lg font-medium">File Count</h3>
                  <p className="text-3xl font-bold">{user.fileCount}</p>
                </div> */}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="personal" className="mt-8">
            <TabsList>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={firebaseUser?.displayName || ""}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={firebaseUser?.email || ""}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Button variant="outline">
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your account via email
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications on your device
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Current Plan</h3>
                    <p className="text-2xl font-bold">{user.accountType}</p>
                  </div>
                  <Button>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Payment Methods
                  </Button>
                  <Button variant="outline">Upgrade Plan</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {user.recentActivity.map((activity, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.item}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.date}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline">View All Activity</Button>
            </CardFooter>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>
                Download a copy of your account data and file list
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline">Export Data</Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
}
