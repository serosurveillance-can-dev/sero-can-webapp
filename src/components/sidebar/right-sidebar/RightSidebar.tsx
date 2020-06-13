import React from "react";
import Filters from "./Filters";
import LastUpdated from "./LastUpdated";
import "../sidebar.css"
import "./RightSidebar.css"

export default function RightSidebar() {
  return (
    <div className="justify-content-between sidebar-container">
      <div className="filters-container mb-3">
        <Filters/>
      </div>
      <div>
        <LastUpdated/>
      </div>
    </div>
  )
}