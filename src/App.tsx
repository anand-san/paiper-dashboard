import React, { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./hooks/useAuth";
import Layout from "./pages/Layout";
import Loader from "./components/loader/Loader";

const FileManager = React.lazy(() => import("./pages/my-files/FileManager"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Profile = React.lazy(() => import("./pages/Profile"));
const IntegrationSection = lazy(
  () => import("./pages/integrations/Integrations")
);

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, navigate, loading]);

  if (loading) {
    return (
      <div className="h-screen flex">
        <Loader />
      </div>
    );
  }

  return <Layout />;
};
const App: React.FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="files" element={<FileManager />} />
            <Route path="profile" element={<Profile />} />
            <Route path="integrations" element={<IntegrationSection />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
      </Router>
    </Suspense>
  );
};

export default App;
