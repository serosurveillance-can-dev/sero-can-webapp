import React, { useState, useContext } from "react";
import { AppContext } from "../../context";
import { Sidebar, Segment, Menu } from "semantic-ui-react";
import Filters from "../sidebar/right-sidebar/Filters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faFilter, faBars } from "@fortawesome/free-solid-svg-icons";
import TotalStats from "../sidebar/left-sidebar/TotalStats";
import DateRangeSlider from "../sidebar/right-sidebar/date-slider/Slider";
import LastUpdated from "../sidebar/right-sidebar/LastUpdated";
import AnalysisMethods from "../sidebar/left-sidebar/AnalysisMethods";
import Charts from "../charts/Charts";
import Map from '../map/Map';


export default function ExploreMobile() {
  const [showMobileFilters, setShowFilters] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleFilterToggle = (showMobile: boolean, showSummary: boolean) => {
    setShowFilters(showMobile);
    setShowSummary(showSummary);
  }

  return (
    <div className="fill flex">
      <Sidebar.Pushable as={Segment} className="fill flex">
        {/* Filters */}
        <Sidebar
          as={Menu}
          animation='overlay'
          icon='labeled'
          className="col-10 p-0"
          vertical
          direction="left"
          visible={showMobileFilters}
          width='wide'
        >

          <Filters />
          <DateRangeSlider />
          <LastUpdated />
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => handleFilterToggle(false, false)}
            className={'icon'}
            color={'#455a64'}
            style={{ fontWeight: 300, position: 'absolute', zIndex: 3000, top: 10, right: 20 }}
            size={"lg"} />
        </Sidebar>
        {/* Left Sidebar */}
        <Sidebar
          as={Menu}
          animation='overlay'
          icon='labeled'
          className="col-10 p-0"
          vertical
          direction="left"
          visible={showSummary}
          width='wide'
        >
          <TotalStats />
          <AnalysisMethods />
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => handleFilterToggle(false, false)}
            className={'icon'}
            color={'#455a64'}
            style={{ fontWeight: 300, position: 'absolute', zIndex: 3000, top: 10, right: 20 }}
            size={"lg"} />
        </Sidebar>
        <Sidebar.Pusher className="fill flex">
          <Map />
          {/* Icons */}
          <div className="icon-container"
            style={{ top: 10, right: 15 }}>
            <FontAwesomeIcon
              icon={faFilter}
              onClick={() => handleFilterToggle(!showMobileFilters, false)}
              className={'icon'}
              color={'#455a64'}
              size={"2x"} />
          </div>
          <div className="icon-container"
            style={{ top: 10, right: 58 }}>
            <FontAwesomeIcon
              icon={faBars}
              onClick={() => handleFilterToggle(false, !showSummary)}
              className={'icon'}
              color={'#455a64'}
              size={"2x"} />
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  )
}