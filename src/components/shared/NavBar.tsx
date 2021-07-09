import { faFileAlt, faGlobeAmericas, faUsers, faTable, faChartBar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Link, useHistory, useLocation } from 'react-router-dom'
import MultiColorIcon from '../../assets/images/colored-icon.svg'
import { mobileDeviceOrTabletWidth } from '../../constants'
import { AppContext } from '../../context'
import { LanguageType } from '../../types'
import Translate from '../../utils/translate/translateService'
import { withLocaleUrl } from '../../utils/utils'
import PartnershipsDropDown from './PartnershipsDropDown'

export const NavBar = () => {
  const [tab, setTab] = useState("");
  const [state, dispatch] = useContext(AppContext);

  const getTabClass = (tabName: string) => {
    const style = tabName === tab ? 'bold col-auto h-100 flex center-item' : 'regular col-auto h-100 flex center-item';
    return isMobileDeviceOrTablet ? style.concat(" px-1") : style;
  }

  const usePageViews = () => {
    let location = useLocation();
    useEffect(() => {
      setTab(location.pathname)
    }, [location]);
  }

  const history = useHistory();

  const changeLanguages = () => {
    let url = history.location.pathname;
    if (state.language === LanguageType.english) {
      url = url.replace("/en/", "/fr/")
    }
    else {
      url = url.replace("/fr/", "/en/")
    }
    dispatch(
      {
        type: "SELECT_LANGUAGE",
        payload: state.language === LanguageType.english ? LanguageType.french : LanguageType.english
      })

    history.push(url)
  }

  usePageViews()
  const isMobileDeviceOrTablet = useMediaQuery({ maxDeviceWidth: mobileDeviceOrTabletWidth })
  return (
    <header className="App-header col-12 px-sm-2">
      <div className="App-title col-auto py-3 px-0 flex left">
        <Link to={withLocaleUrl("Explore")} className="flex">
          <img src={MultiColorIcon} width={23} height={23} alt="" />
          {!isMobileDeviceOrTablet && (<div className="col-auto px-2" >SeroTracker</div>)}
        </Link>
      </div>
      <div className={`App-tabs col-auto space-evenly p-0 ${isMobileDeviceOrTablet ? 'fill' : ''}`}>
        <div className={getTabClass('/Explore')}>
          <Link to={withLocaleUrl("Explore")}>
            {isMobileDeviceOrTablet ?
              <FontAwesomeIcon icon={faGlobeAmericas} size="lg" /> :
              Translate('Explore')}
          </Link>
        </div>
        <div className={getTabClass('/Analyze')}>
          <Link to={withLocaleUrl("Analyze")}>
            {isMobileDeviceOrTablet ?
              <FontAwesomeIcon icon={faChartBar} size="lg" /> :
              Translate('Analyze')}
          </Link>
        </div>
        <div className={getTabClass('/Data')}>
          <Link to={withLocaleUrl("Data")}>
            {isMobileDeviceOrTablet ?
              <FontAwesomeIcon icon={faTable} size="lg" /> :
              Translate('Data')}
          </Link>
        </div>
        <div className={getTabClass('/Publications')}>
          <Link to={withLocaleUrl("Publications")}>
            {isMobileDeviceOrTablet ?
              <FontAwesomeIcon icon={faFileAlt} size="lg" /> :
              Translate('Publications')}
          </Link>
        </div>
        <div className={getTabClass('/About')}>
          <Link to={withLocaleUrl("About")}>
            {isMobileDeviceOrTablet ?
              <FontAwesomeIcon icon={faUsers} size="lg" /> :
              Translate('About')}
          </Link>
        </div>
        <div className={getTabClass('/Partnerships')}>
          <PartnershipsDropDown />
        </div>
        <div className={getTabClass('/Language') + " cursor"} onClick={() => changeLanguages()}>
          <div>
            {state.language === LanguageType.english ?
              (isMobileDeviceOrTablet ? "Fr" : "Français") :
              (isMobileDeviceOrTablet ? "En" : "English")}
          </div>
        </div>
      </div>
    </header >
  )
}