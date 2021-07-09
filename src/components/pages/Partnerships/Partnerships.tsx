import React, { useContext, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { AirtableRecord } from "types";
import { isMaintenanceMode } from "../../../constants";
import { AppContext } from "../../../context";
import MaintenanceModal from "../../shared/MaintenanceModal";
import TableauEmbed from "components/shared/TableauEmbed";
import PartnershipsConfig from "PartnershipsConfig";
import Translate, { getCountryName } from "utils/translate/translateService";
import { Loader } from "semantic-ui-react";
import Legend from "components/map/Legend";
import MapboxMap from "components/map/MapboxMap";
import httpClient from 'httpClient'

export default function Partnerships() {
  const [state] = useContext(AppContext);
  const [records, setRecords] = useState<AirtableRecord[]>([]);
  const { name } = useParams<{ name: string }>();
  const config = PartnershipsConfig.find(x => x.routeName === name);

  useEffect(() => {
    const api = new httpClient();
    const getPartnershipsRecords = async () => {
      const records = await api.getAirtableRecordsForCountry({country: [config?.routeName]});
      setRecords(records);
    }
    getPartnershipsRecords()
  }, [config])

  return (
    <>
      {config !== undefined ? (
        <>
          <div className="col-12 page">
            <div className="col-10">
              <div className="mt-5 mb-1">
                <h3>
                  {Translate("SeroprevalenceEstimatesInRegion", null, {
                    NAME: getCountryName(config.routeName, state.language, "CountryOptions"),
                  })}
                </h3>
              </div>
              <div style={{ height: "70vh" }} className="row">
                <div className="col-10">
                  <Loader indeterminate active={state.explore.isLoading}></Loader>
                  <MapboxMap
                    mapConfig={config.mapboxMapOptions}
                    countriesConfig={{
                      countryFocus: config.iso3
                    }}
                    studyPinsConfig={{
                      records: records,
                    }}
                  />
                </div>
                <div className="col-2">
                  <Legend />
                  <div className="mt-5">{Translate("PartnershipsView", ["MapNote1"])}</div>
                  <div className="mt-3">
                    {Translate("PartnershipsView", ["MapNote2"], {
                      WEBSITE: "ourworldindata.org",
                    })}
                  </div>
                </div>
              </div>
              <div className="row">
                <TableauEmbed
                  url={config.tableauUrl}
                  key={config.tableauKey}
                  desktopOptions={{
                    width: "83vw",
                    height: "4100px",
                  }}
                  mobileOptions={{
                    width: "90vw",
                    height: "2800px",
                  }}
                />
              </div>
            </div>
          </div>
          <MaintenanceModal isOpen={isMaintenanceMode} headerText={""} />
        </>
      ) : (
        <Redirect to="/404" />
      )}
    </>
  );
}
