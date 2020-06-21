import _ from "lodash";
import React, { useContext } from "react";
import { AppContext } from "../../../context";
import { getAggregateData } from "../../../metaAnalysis";
import { AggregationFactor } from "../../../types";
import './CountryList.css';
import Translate from "../../../utils/translate/translateService";

export default function CountryList() {
  const [state] = useContext(AppContext);
  // Factor in "include_in_n" for population unfiltered geography estimates
  const must_include_in_n = state.filters.population_group.size === 0;
  const aggregatedData = _.sortBy(getAggregateData(state.filtered_records, AggregationFactor.country, must_include_in_n), ['seroprevalence']).reverse();

  return (
    <div className="country-list">
      <div className="section-title py-2 center">
        {Translate('SeroPrevalenceByCountry').toUpperCase()}
      </div>
      <div className="list">
          {aggregatedData.map(o => {
            return (
              <div className="flex item-container" key={Math.random()}>
                <div className="p-2 country-name center-item">
                  {o.name}
                </div>
                <div className="p-2 country-stat center-item">
                  {(o.seroprevalence as Number).toFixed(2)}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}