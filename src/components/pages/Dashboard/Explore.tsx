import React , { useContext, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Loader } from "semantic-ui-react";
import { isMaintenanceMode, mobileDeviceOrTabletWidth } from "../../../constants";
import { AppContext } from "../../../context";
import { PageStateEnum } from "../../../types";
import Map from '../../map/Map';
import ArcMap from "../../map/ArcMap"
import MobileComponents from '../../mobile/ExploreMobile';
import MaintenanceModal from "../../shared/MaintenanceModal";
import LeftSidebar from "../../sidebar/left-sidebar/LeftSidebar";
import RightSidebar from "../../sidebar/right-sidebar/RightSidebar";

export default function Explore() {
  const isMobileDeviceOrTablet = useMediaQuery({ maxDeviceWidth: mobileDeviceOrTabletWidth });
  const [state, dispatch] = useContext(AppContext)

  useEffect(() => {
    dispatch({
      type: "UPDATE_EXPLORE_IS_OPEN",
      payload: true
    })
    return () => {
      dispatch({
        type: "UPDATE_EXPLORE_IS_OPEN",
        payload: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="fill flex dashboard">
        {!isMobileDeviceOrTablet ?
          (<div className="fill flex">
            <div className="col-2 p-0 flex">
              <LeftSidebar page={PageStateEnum.explore} />
            </div>
            <div className="col-8 p-0 flex">
              <Loader indeterminate active={state.explore.isLoading}></Loader>
              <ArcMap />
            </div>
            <div className="col-2 p-0 flex">
              <RightSidebar page={PageStateEnum.explore} />
            </div>
          </div>) :
          (
            <div className="fill flex">
              <MobileComponents />
            </div>
          )}
      </div >
      <MaintenanceModal isOpen={isMaintenanceMode} headerText={"Explore"} />
    </>
  )
}
