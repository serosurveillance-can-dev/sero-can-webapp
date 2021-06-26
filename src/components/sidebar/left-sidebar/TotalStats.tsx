import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context";
import { State, PageState } from "../../../types";
import Translate from "../../../utils/translate/translateService";
import "./TotalStats.css";

interface TotalStatsProps {
  page: string;
}

export default function TotalStats({ page }: TotalStatsProps) {
  const [state] = useContext(AppContext);
  const [countries, setNumCountries] = useState(0);
  const [numStudies, setNumStudies] = useState(0);
  const [n, setN] = useState(0);
  const pageState = state[page as keyof State] as PageState;

  useEffect(() => {
    const updateCountryPrevalence = async () => {
      setNumCountries(pageState.estimateGradePrevalences.length);
      setN(
        pageState.estimateGradePrevalences
          .map((o: Record<string, any>) => o.testsAdministered)
          .reduce((a: number, b: number) => a + b, 0)
      );
      setNumStudies(
        pageState.estimateGradePrevalences
          .map((o: Record<string, any>) => o.numberOfStudies)
          .reduce((a: number, b: number) => a + b, 0)
      );
    };
    updateCountryPrevalence();
  }, [pageState.estimateGradePrevalences]);

  return (
    <div className="col-12 p-0 stats-container">
      <div className="col-12 pb-2 pt-4 section-title center">
        {Translate("SummaryStatistics").toUpperCase()}
      </div>
      <div className="flex middle py-2">
        <div className="secondary-statistic">{numStudies}</div>
        <div className="secondary-statistic-title px-1 center">
          {Translate("SeroprevalenceStudies")}
        </div>
      </div>
      <div className="flex middle py-2">
        <div className="secondary-statistic-title px-1 center">
          {Translate("CountriesIncluded", ["PartOne"])}
        </div>
        <div className="secondary-statistic">{countries}</div>
        <div className="secondary-statistic-title px-1 center">
          {Translate("CountriesIncluded", ["PartTwo"])}
        </div>
      </div>
      <div className="flex middle py-2">
        <div className="secondary-statistic-title center px-1">
          {Translate("IncludingParticipants", ["PartOne"])}
        </div>
        <div className="secondary-statistic center">{n.toLocaleString()}</div>
        <div className="secondary-statistic-title px-1 center ">
          {Translate("IncludingParticipants", ["PartTwo"])}
        </div>
      </div>
      <br />
    </div>
  );
}
