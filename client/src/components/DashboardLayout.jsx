// src/components/DashboardLayout.jsx
import React from "react";
import Header from "./Header";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      {/* <Header /> */}
      <main className="container mt-4">{children}</main>
    </div>
  );
};

export default DashboardLayout;
