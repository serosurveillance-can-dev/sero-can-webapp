import { faBars, faFilter, faTimes} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {  useState, useContext } from "react";
import { AppContext } from "context";
import { Menu, Segment, Sidebar } from "semantic-ui-react";
import { PageStateEnum } from "../../types";
import MapboxMap from "components/map/MapboxMap"
import AnalysisMethods from "../sidebar/left-sidebar/AnalysisMethods";
import TotalStats from "../sidebar/left-sidebar/TotalStats";
import Datepicker from "../sidebar/right-sidebar/datepicker/Datepicker";
import Filters from "../sidebar/right-sidebar/Filters";
import Legend from "components/map/Legend";
import Translate from "utils/translate/translateService";
import WhoLogo from "components/shared/WhoLogo"


export default function ExploreMobile() {
  const [showMobileFilters, setShowFilters] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [state] = useContext(AppContext);

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
        <Filters page={PageStateEnum.explore}/>
        <Datepicker page={PageStateEnum.explore}/>
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
          <TotalStats page={PageStateEnum.explore}/>
          <AnalysisMethods />
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => handleFilterToggle(false, false)}
            className={'icon'}
            color={'#455a64'}
            style={{ fontWeight: 300, position: 'absolute', zIndex: 3000, top: 10, right: 20 }}
            size={"lg"} />
            <a href="https://www.who.int/" className="d-block mt-3 mx-auto" target="__blank" rel="noopener noreferrer">
          <WhoLogo className="d-block mx-auto" height="50"/>
        </a>
        <p className="d-block mx-3 mt-3">
          <small>
          {Translate('WhoSerotrackAndPartnersDisclaimerSmall')}
          </small>
        </p>
        </Sidebar>
        <Sidebar.Pusher className="fill flex">
          <div className="info flex legend center-item">
            <Legend/>
          </div>
          <MapboxMap 
              countriesConfig={{
                estimateGradePrevalences: state.explore.estimateGradePrevalences
              }} 
              studyPinsConfig={{
                records: state.explore.records
              }}
              />
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
