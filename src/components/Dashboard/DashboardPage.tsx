import React from "react";
import useAuth from "../../hooks/useAuth";
import { Layout } from "../Layout/Layout";
import { DashboardContent } from "../MainPage/components/DashboardContent";

const DashboardPage: React.FC = () => {
  const { roles } = useAuth();
  const userRoles = roles.map(role => role.Rol);
  
  return (
    <Layout>
      <div className="content-container" style={{ minHeight: '400px' }}>
        <DashboardContent userRoles={userRoles} />
      </div>
    </Layout>
  );
};

export default DashboardPage;