import React, { useContext, useEffect, useRef, useState, Dispatch } from "react";
import { AppContext } from "context";
import { getEsriVectorSourceStyle, addEsriLayersFromVectorSourceStyle } from "utils/MappingUtil";
import Countries from "components/map/Layers/Countries";
import StudyPins from "components/map/Layers/StudyPins";
import { MapResources, DefaultMapboxMapOptions } from 'components/map/MapConfig'
import { CountriesMapConfig, StudyPinsMapConfig } from "types";
// @ts-ignore
// eslint-disable-next-line
import mapboxgl, { Style } from '!mapbox-gl';
import "components/map/MapboxMap.css";
import "mapbox-gl/dist/mapbox-gl.css";

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY as string;

function mapOnLoad(map: mapboxgl.Map, dispatch: Dispatch<any>) {
  getEsriVectorSourceStyle(MapResources.WHO_COUNTRY_VECTORTILES).then((style: mapboxgl.Style) => {
    addEsriLayersFromVectorSourceStyle(style, map);
    const styleJson: Style = map.getStyle();
    let CountryPolygonsMoved = false;
    if (styleJson && styleJson.layers) {
      for (let layer of styleJson.layers as any) {
        const source = layer["source-layer"];
        if (source === "DISPUTED_AREAS") {
          if (!CountryPolygonsMoved)
          {
            map.moveLayer("Countries", layer.id); // HACK for now, moves countries layer behind border once loaded.
          }

          map.on("mouseenter", layer.id, function (e: any) {
            dispatch({ type: 'HIDE_COUNTRY_HOVER' })
          });
          map.on("mouseleave", layer.id, function (e: any) {
            dispatch({ type: 'SHOW_COUNTRY_HOVER' })
          });
        }
      }
    }
  });
}

interface MapboxMapProps {
  mapConfig?: any
  countriesConfig: CountriesMapConfig,
  studyPinsConfig: StudyPinsMapConfig
}

const MapboxMap = ( {mapConfig, countriesConfig, studyPinsConfig}: MapboxMapProps ): any => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useContext(AppContext);
  const [map, setMap] = useState<mapboxgl.Map | undefined>(undefined);

  // Creates map, only runs once
  useEffect(() => {
    (async () => {
      const baseMapStyle = await getEsriVectorSourceStyle(MapResources.WHO_BASEMAP);

      const mergedOptions = { // Merges options together to configure map
        ...{
          container: mapContainerRef.current,
          style: baseMapStyle,
        },
        ...DefaultMapboxMapOptions,
        ...mapConfig,
      };

      const m = new mapboxgl.Map(mergedOptions);

      m.on("load", () => {
        mapOnLoad(m, dispatch);
        setMap(m);
      });
    })();

    return () => map?.remove();
  }, []);

  // Adds country data to map and binds pin behaviour with map popups
  Countries(map, countriesConfig);
  // Adds pins to map and binds pin behaviour with map popups
  StudyPins(map, studyPinsConfig);

  return (
    //@ts-ignore
    <div className="w-100 h-100" ref={(el) => (mapContainerRef.current = el)}></div>
  );
};

export default MapboxMap;
