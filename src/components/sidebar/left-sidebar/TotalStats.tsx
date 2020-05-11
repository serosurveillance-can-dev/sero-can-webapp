import React, { useContext } from "react";
import { AppContext } from "../../../context";
import { aggregateRecords, getAggregateData, aggregationFactor } from "../../../metaAnalysis";
import './TotalStats.css'

export default function TotalStats() {
  const [state] = useContext(AppContext);

  //TODO use a better and less resource intensive way of calculating amount of countries.
  const { seroprevalence, n } = aggregateRecords(state.filtered_records);
  const aggregatedData = getAggregateData(state.filtered_records, aggregationFactor.country);
  const countries = aggregatedData.length

  return (
    <div className="col-12 p-0">
      <div className="col-12 py-3 section-title center">SUMMARY STATISTICS</div>
      <div className="col-12 p-0 flex">
          <div className="main-statistic-title col-12 p-0 center">Seroprevalence</div>
          <div className="main-statistic col-12 p-0 center">{seroprevalence.toFixed(2)}%</div>
      </div>
      <div className="col-12 flex middle py-4">
          <div className="secondary-statistic-title center p-0 col-12">Tests Administered</div>
          <div className="secondary-statistic col-12 p-0 center">{n}</div>
      </div>
      <div className="col-12 flex middle py-2">
          <div className="secondary-statistic px-1 center">{countries}</div>
          <div className="secondary-statistic-title px-1 center">Countries</div>
      </div>
    </div>
  )
}