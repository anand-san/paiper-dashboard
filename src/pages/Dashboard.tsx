import React from "react";
import Layout from "./Layout";
import { useAuth } from "@/hooks/useAuth";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard! {user?.email}</p>
    </Layout>
  );
};

export default Dashboard;
