import React , { useContext, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Loader } from "semantic-ui-react";
import { isMaintenanceMode, mobileDeviceOrTabletWidth } from "../../../constants";
import { AppContext } from "../../../context";
import { PageStateEnum, Filters } from "../../../types";
import MapboxMap from '../../map/MapboxMap';
import MobileComponents from '../../mobile/ExploreMobile';
import MaintenanceModal from "../../shared/MaintenanceModal";
import LeftSidebar from "../../sidebar/left-sidebar/LeftSidebar";
import RightSidebar from "../../sidebar/right-sidebar/RightSidebar";
import Legend from "components/map/Legend";
import { initializeData } from "../../../utils/stateUpdateUtils";
import httpClient from "../../../httpClient";

interface ExploreProps {
  initialFilters?: Filters;
}

export default function Explore(props: ExploreProps) {
  const isMobileDeviceOrTablet = useMediaQuery({ maxDeviceWidth: mobileDeviceOrTabletWidth });
  const [state, dispatch] = useContext(AppContext);

  // Apply initial input filters and get records
  useEffect(() => {
    if(props.initialFilters){
      dispatch({
        type: 'UPDATE_ALL_FILTERS',
        payload: {
          newFilters: props.initialFilters,
          pageStateEnum: PageStateEnum.explore
        }
      });
    }
    const api = new httpClient();
    initializeData(dispatch, state.explore.filters, PageStateEnum.explore)
    // We only want this to run once so we pass no dependencies. Do not remove this
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
              <div className="info flex legend center-item">
                <Legend/>
              </div>
              <MapboxMap/>
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
