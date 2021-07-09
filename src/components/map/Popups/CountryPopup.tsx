import React from "react";
import { RegionalPrevalenceEstimate } from "types";
import { LanguageType } from "types";
import { Button } from 'semantic-ui-react'
import Translate, { getCountryName } from 'utils/translate/translateService';

const createPopupGeographySection = (regionalEstimate: RegionalPrevalenceEstimate, title: string) => {
  const minString = `${(regionalEstimate.minEstimate * 100).toFixed(2)}%`
  const maxString = `${(regionalEstimate.maxEstimate * 100).toFixed(2)}%`
  const regionString = minString === maxString ? minString : `${minString} - ${maxString}`;

  return (
    <div key={Math.random()} className={"flex fit column popup-heading mt-2"}>
      <div key={Math.random()} className="popup-heading pt-1">{title}</div>
      <div key={Math.random()} className="col-12 p-0 popup-text">{Translate('EstimateRange')}: <b>{regionString}</b></div>
      <div key={Math.random()} className="col-12 p-0 popup-text">{Translate('NumberEstimates')}: <b>{regionalEstimate.numEstimates}</b></div>
    </div>
  )
}

const CountryPopup = (country : any, language : LanguageType, onDetailsClick?: any) => {

  const properties = country?.state

  if (properties.testsAdministered) {
    const regions: Array<any> = []
    let addRegion = (r: RegionalPrevalenceEstimate, name: string) => { 
      return (r !== undefined && r.numEstimates !== 0 ? regions.push({Region: r, Name: name}) : null) 
    }
    addRegion(properties.nationalEstimate, Translate('NationalEstimates'));
    addRegion(properties.regionalEstimate, Translate('RegionalEstimates'));
    addRegion(properties.localEstimate, Translate('LocalEstimates'));
    addRegion(properties.sublocalEstimate, Translate('SublocalEstimates'));

    return (
      <div className="col-12 p-0 flex column country-popup popup-content" >
        <div className="fit popup-title">{getCountryName(properties.geographicalName, language, "CountryOptions")}</div>
        <div className="flex column fit popup-heading">
          <div className="fit popup-text">{Translate("TestsAdministered")}: <b>{properties?.testsAdministered}</b></div>
          <div className="fit popup-text">{Translate('NumSeroprevalenceEstimates')}: <b>{properties?.numberOfStudies}</b></div>
        </div>
        {regions.map((o) => createPopupGeographySection(o.Region, o.Name))}
        {onDetailsClick ? 
        <Button className="not-found-button mt-2" onClick={()=>{ onDetailsClick()}}>
          {Translate("ViewPartnership")}
        </Button> : ""}
      </div>)
  };

  return (
    <div className="col-12 p-0 flex">
      <div className="fit popup-title">{getCountryName(properties.geographicalName, language, "CountryOptions")}</div>
      <div className="col-12 p-0 flex popup-text">{Translate('NoData')}</div>
    </div>)
}

export default CountryPopup;