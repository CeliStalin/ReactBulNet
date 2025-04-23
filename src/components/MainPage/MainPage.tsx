import React from "react";
import useAuth from "../../hooks/useAuth";
import { Layout } from "../Layout/Layout";
import { DashboardContent } from "./components/DashboardContent";

const Mainpage: React.FC = () => {
  const { roles } = useAuth();
  const userRoles = roles.map(role => role.Rol);
  
  return (
    <Layout>
      <DashboardContent userRoles={userRoles} />
    </Layout>
  );
};

export { Mainpage };