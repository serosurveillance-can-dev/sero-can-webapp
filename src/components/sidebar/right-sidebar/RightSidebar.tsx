import React from "react";
import "../sidebar.css";
import Datepicker from "./datepicker/Datepicker";
import Filters from "./Filters";
import "./RightSidebar.css";

interface SideBarProps {
  page: string
}

export default function RightSidebar({page}: SideBarProps) {
  return (
    <div className="justify-content-between fill sidebar-container right-sidebar">
      <div className="filters-container mb-3">
        <Filters page={page}/>
      </div>
    </div>
  )
}