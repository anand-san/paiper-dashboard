import { auth } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";

const UserProfile = () => {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

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
          <button
            onClick={handleLogout}
            className="mt-6 bg-red-500 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default UserProfile;
