import { useState, useEffect, useContext } from "react"
import ReactDOMServer from "react-dom/server";
import StudyPopup from "components/map/Popups/StudyPopup";
import { AppContext } from "context";
import { AirtableRecord } from "types";
import httpClient from "httpClient";
import mapboxgl from "mapbox-gl";
import generateSourceFromRecords from "utils/GeoJsonGenerator";
import MapConfig from "components/map/MapConfig"

const StudyPins = (map: mapboxgl.Map | undefined, records: AirtableRecord[]) => {

  const [state] = useContext(AppContext);
  const [api] = useState(new httpClient());

  useEffect(() => {
    if (map && records.length > 0 && map.getLayer("study-pins") === undefined) {
      const src: any = generateSourceFromRecords(records);

      //@ts-ignore
      src.data.features.filter(pin => {
        map.queryRenderedFeatures(pin.geometry.coordinates).forEach(f => {
          if (f.layer['source-layer'] === "DISPUTED_AREAS") {
            return false
          }
        })
        return true
      })
      
      map.addSource("study-pins", src);
      map.addLayer({
        id: "study-pins",
        type: "circle",
        source: "study-pins",
        paint: MapConfig.Studies
      });
    }
    else if (map && map.getLayer("study-pins")) {

      var onlyGuid: (string | null)[] = records.map((r) => { return r.source_id })

    map?.setFilter('study-pins',
      ["in",
        ['get', 'source_id'],
        ["literal", onlyGuid]
      ]);
    }
  }, [map, records]);

  useEffect(() => {
    if (map) {
      map?.setFilter('study-pins',
      [
        "match",
        ["get", "estimate_grade"],
        "National", state.explore.legendLayers.National,
        "Regional", state.explore.legendLayers.Regional,
        "Local", state.explore.legendLayers.Local,
        "Sublocal", state.explore.legendLayers.Local,
        false,
      ]
      );
    }
  }, [map, state.explore.legendLayers]);

  useEffect(() => {
    if (map) {
      map.on("click", "study-pins", function (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) {
        const source_id = e.features[0].properties.source_id;

        const test = map.queryRenderedFeatures(e.geometry.coordinates)

        api.getRecordDetails(source_id).then((record) => {
          if (record !== null) {
            new mapboxgl.Popup({ offset: 5, className: "pin-popup" })
              .setLngLat(e.lngLat)
              .setHTML(ReactDOMServer.renderToString(StudyPopup(record)))
              .setMaxWidth("300px")
              .addTo(map);
          }
        });
      });

      map.on("mouseenter", "study-pins", function () {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "study-pins", function () {
        map.getCanvas().style.cursor = "";
      });
    }
  }, [map, state.language, api])

  return;
}

export default StudyPins;