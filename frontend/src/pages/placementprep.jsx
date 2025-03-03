import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import Aptitude from "../sections/Aptitude";
// import Technical from "./sections/Technical";
// import Resume from "./sections/Resume";
// import MockInterview from "./sections/MockInterview";
// import CompanyPrep from "./sections/CompanyPrep";
// import ProgressTracker from "./sections/ProgressTracker";

const PlacementPrep = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="placement-prep">
      {/* Sub-Navbar Below Main Navbar */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="primary"
        textColor="primary"
        className="sub-navbar"
      >
        <Tab label="Aptitude" />
        <Tab label="Technical" />
        <Tab label="Resume" />
        <Tab label="Mock Interview" />
        <Tab label="Company Prep" />
        <Tab label="Progress Tracker" />
      </Tabs>

      {/* Content Based on Active Tab */}
      <div className="tab-content">
        {activeTab === 0 && <Aptitude />}
        {activeTab === 1 && <Technical />}
        {activeTab === 2 && <Resume />}
        {activeTab === 3 && <MockInterview />}
        {activeTab === 4 && <CompanyPrep />}
        {activeTab === 5 && <ProgressTracker />}
      </div>
    </div>
  );
};

export default PlacementPrep;
