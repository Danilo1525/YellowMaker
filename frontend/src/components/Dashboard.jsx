import React, { useState } from "react";
import FileUpload from "./FileUpload";
import TableBuilder from "./TableBuilder";
import DashboardEditor from "./DashboardEditor";
import Layout from "./Layout";
import Management from "./Management";

export default function Dashboard({ onLogout }) {
  const [currentView, setCurrentView] = useState("editor"); // 'editor' | 'upload' | 'table' | 'management'
  const [loadedDashboard, setLoadedDashboard] = useState(null);

  const handleSelectDashboard = (dashboard) => {
    setLoadedDashboard(dashboard);
    setCurrentView("editor");
  };

  const renderContent = () => {
    switch (currentView) {
      case "editor":
        return <DashboardEditor initialDashboard={loadedDashboard} />;
      case "upload":
        return <FileUpload />;
      case "table":
        return <TableBuilder />;
      case "management":
        return <Management onSelectDashboard={handleSelectDashboard} />;
      default:
        return <DashboardEditor initialDashboard={loadedDashboard} />;
    }
  };

  return (
    <Layout
      onLogout={onLogout}
      currentView={currentView}
      setCurrentView={setCurrentView}
    >
      <div className="space-y-6">{renderContent()}</div>
    </Layout>
  );
}
