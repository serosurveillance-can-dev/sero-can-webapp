import React, { useContext } from "react";
import { AppContext } from "../../context";
import "./Legend.css";
import Translate from "../../utils/translate/translateService";
import { MapSymbology } from "components/map/MapConfig"

export default function Legend() {
  const [state, dispatch] = useContext(AppContext);
  const handleLegendToggle = (e: React.MouseEvent<HTMLElement>) => {
    const layerName: string = e.currentTarget.id;
    switch (layerName) {
      case "National": {
        return dispatch({ type: "TOGGLE_NATIONAL_PIN_LAYER" });
      }
      case "Regional": {
        return dispatch({ type: "TOGGLE_REGIONAL_PIN_LAYER" });
      }
      case "Local": {
        return dispatch({ type: "TOGGLE_LOCAL_PIN_LAYER" });
      }
    }
  };

  return (
    <div className="flex legend-container" key={Math.random()}>
      <div className="legend-item" id="National" onClick={handleLegendToggle}>
        <i className="circleBase legend-icon" style={{ background: MapSymbology.StudyFeature.National.Color }}></i>
        <label>{Translate("NationalStudies")}</label>
        <input className="ui checkbox legend-checkbox" type="checkbox" checked={state.explore.legendLayers.National} readOnly />
      </div>
      <div className="legend-item" id="Regional" onClick={handleLegendToggle}>
        <i className="circleBase legend-icon" style={{ background: MapSymbology.StudyFeature.Regional.Color }}></i>
        <label>{Translate("RegionalStudies")}</label>
        <input className="ui checkbox legend-checkbox" type="checkbox" checked={state.explore.legendLayers.Regional} readOnly />
      </div>
      <div className="legend-item mb-1" id="Local" onClick={handleLegendToggle}>
        <i className="circleBase legend-icon" style={{ background: MapSymbology.StudyFeature.Local.Color }}></i>
        <label>{Translate("LocalStudies")}</label>
        <input className="ui checkbox legend-checkbox" type="checkbox" checked={state.explore.legendLayers.Local} readOnly />
      </div>
      <div className="legend-item">
        <i className="block legend-icon" style={{ background: MapSymbology.CountryFeature.HasData.Color, outlineWidth: 1, outlineStyle: "solid" }}></i>
        <label>{Translate("CountryEstimatesExist")}</label>
      </div>
      <div className="legend-item">
        <i className="block legend-icon" style={{ background: MapSymbology.CountryFeature.Default.Color, outlineWidth: 1, outlineStyle: "solid" }}></i>
        <label>{Translate("CountryEstimatesNotExist")}</label>
      </div>
      <div className="legend-item">
        <i className="block legend-icon" style={{ background: MapSymbology.CountryFeature.Disputed.Color, outlineWidth: 1, outlineStyle: "solid" }}></i>
        <label>{Translate("NotApplicable")}</label>
      </div>
    </div>
  )
}
