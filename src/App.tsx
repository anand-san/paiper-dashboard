import React, { useEffect } from "react";
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
import Dashboard from "./pages/Dashboard";
import MyFiles from "./pages/MyFiles";
import Profile from "./pages/Profile";
import Loader from "./components/loader/Loader";
import IntegrationSection from "./pages/integrations/Integrations";
import FileManager from "./pages/FileManager";

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
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="files" element={<MyFiles />} />
          <Route path="file-manager" element={<FileManager />} />
          <Route path="profile" element={<Profile />} />
          <Route path="integrations" element={<IntegrationSection />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </Router>
  );
};

export default App;
