import React, { useContext, useEffect, useRef, useState, Dispatch } from "react";
import { AppContext } from "context";
import { getEsriVectorSourceStyle, addEsriLayersFromVectorSourceStyle } from "utils/EsriMappingUtil";
import Legend from "components/map/Legend";
import Countries from "components/map/Layers/Countries";
import StudyPins from "components/map/Layers/StudyPins";
import { MapUrlResource } from 'components/map/MapConfig'
// @ts-ignore
// eslint-disable-next-line
import mapboxgl from '!mapbox-gl';
import "components/map/MapboxMap.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { State } from "types";

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY as string;

function mapOnLoad(map: mapboxgl.Map, dispatch: Dispatch<any>) {
  getEsriVectorSourceStyle(MapUrlResource.WHO_COUNTRY_VECTORTILES).then((style: mapboxgl.Style) => {
    addEsriLayersFromVectorSourceStyle(style, map);
    const styleJson: any = map.getStyle();
    if (styleJson && styleJson.layers) {
      for (let layer of styleJson.layers) {
        const t = layer["source-layer"];
        if (t === "DISPUTED_AREAS") {
          map.moveLayer("Countries", layer.id); // HACK for now, moves countries layer behind border once loaded.
          break;
        }
      }
    }

    map.on("mousemove", "Boundaries/DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin_1", function (e: any) {
      if (e.features[0].state.hasData) {
        dispatch({ type: 'SHOW_COUNTRY_HOVER' })
      }
    });

    map.on("mousemove", "DISPUTED_AREAS", function (e: any) {
      if (e.features[0].state.hasData) {
        dispatch({ type: 'SHOW_COUNTRY_HOVER' })
      }
    });
  });
}

const MapboxGLMap = (): any => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useContext(AppContext);
  const [map, setMap] = useState<mapboxgl.Map | undefined>(undefined);

  // Creates map, only runs once
  useEffect(() => {
    (async () => {
      const baseMapStyle = await getEsriVectorSourceStyle(MapUrlResource.WHO_BASEMAP);

      const m = new mapboxgl.Map({
        //@ts-ignore
        container: mapContainerRef.current,
        style: baseMapStyle,
        center: [10, 30],
        zoom: 2,
        attributionControl: false,
        antialias: true// enables MSAA antialiasing, to help make dotted line WHO borders more visible
      });

      m.on("load", () => {
        mapOnLoad(m, dispatch);
        setMap(m);
      });
    })();

    return () => map?.remove();
  }, []);

  // Adds country data to map and binds pin behaviour with map popups
  Countries(map, state.explore.estimateGradePrevalences);
  // Adds pins to map and binds pin behaviour with map popups
  StudyPins(map, state.explore.records, state.showEstimatePins);

  return (
    //@ts-ignore
    <div className="mapContainer w-100" ref={(el) => (mapContainerRef.current = el)}>
      <Legend/>
    </div>
  );
};

export default MapboxGLMap;
