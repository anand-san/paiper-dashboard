import { useAuth } from "@/hooks/useAuth";

const UserProfile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    user && (
      <div className="shadow-lg rounded-lg p-6 max-w-md mx-auto border">
        <div className="flex items-center space-x-4">
          <img
            src={user?.photoURL || "/user.svg"}
            alt={user?.displayName || "Display name Placeholder"}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold ">{user.displayName}</h2>
            <p className="">{user.email}</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex justify-between">
            <span className="">User ID:</span>
            <span className="font-medium">{user.uid}</span>
          </div>
          <div className="flex justify-between">
            <span className="">Joined:</span>
            <span className="font-medium">
              {user.metadata.creationTime ?? "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="">Last Sign In:</span>
            <span className="font-medium">
              {user.metadata.lastSignInTime ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    )
  );
};

export default UserProfile;
