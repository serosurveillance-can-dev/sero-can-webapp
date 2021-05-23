import React, { useContext, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { isMaintenanceMode, mobileDeviceOrTabletWidth } from "../../../constants";
import { AppContext } from "../../../context";
import { PageStateEnum } from "../../../types";
import MobileComponents from "../../mobile/ExploreMobile";
import MaintenanceModal from "../../shared/MaintenanceModal";
import LeftSidebar from "../../sidebar/left-sidebar/LeftSidebar";
import RightSidebar from "../../sidebar/right-sidebar/RightSidebar";
import Map from "components/map/Map";
import { Loader } from "semantic-ui-react";
import Legend from "components/map/Legend";
import MapboxMap from "components/map/MapboxMap";

const EXPLORE_MAP_CONFIG = {
  center: [10, 30],
  zoom: 2,
  minZoom: 2,
  maxZoom: 14,
}

export default function Explore() {
  const isMobileDeviceOrTablet = useMediaQuery({ maxDeviceWidth: mobileDeviceOrTabletWidth });
  const [_, dispatch] = useContext(AppContext);
  const [state] = useContext(AppContext);

  useEffect(() => {
    dispatch({
      type: "UPDATE_EXPLORE_IS_OPEN",
      payload: true,
    });
    return () => {
      dispatch({
        type: "UPDATE_EXPLORE_IS_OPEN",
        payload: false,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="fill flex dashboard">
        {!isMobileDeviceOrTablet ? (
          <div className="fill flex">
            <div className="col-2 p-0 flex">
              <LeftSidebar page={PageStateEnum.explore} />
            </div>
            <div className="col-8 p-0 flex">
              <Loader indeterminate active={state.explore.isLoading}></Loader>
              <div className="info flex legend center-item">
                <Legend />
              </div>
              <MapboxMap/>
            </div>
            <div className="col-2 p-0 flex">
              <RightSidebar page={PageStateEnum.explore} />
            </div>
          </div>
        ) : (
          <div className="fill flex">
            <MobileComponents />
          </div>
        )}
      </div>
      <MaintenanceModal isOpen={isMaintenanceMode} headerText={"Explore"} />
    </>
  );
}
