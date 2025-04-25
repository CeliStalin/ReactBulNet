import React from "react";
import { Layout } from "../Layout/Layout";
import { MainContent } from "./components/MainContent";
import './styles/animations.css';

const Mainpage: React.FC = () => {
  return (
    <Layout>
      <div className="content-container" style={{ minHeight: '400px' }}>
        <MainContent />
      </div>
    </Layout>
  );
};

export { Mainpage };