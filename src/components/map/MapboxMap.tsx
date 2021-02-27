import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "context";
import { getEsriVectorSourceStyle, addEsriLayersFromVectorSourceStyle } from "utils/EsriMappingUtil";
import Legend from "components/map/Legend";
import Countries from "components/map/Layers/Countries";
import StudyPins from "components/map/Layers/StudyPins";
// @ts-ignore
// eslint-disable-next-line
import mapboxgl from '!mapbox-gl';
import "components/map/MapboxMap.css";
import "mapbox-gl/dist/mapbox-gl.css";

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY as string;

const WHO_BASEMAP =
  "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/WHO_Polygon_Basemap_no_labels/VectorTileServer";
const WHO_COUNTRY_VECTORTILES =
  "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/Countries/VectorTileServer";

function mapOnLoad(map: mapboxgl.Map) {
  getEsriVectorSourceStyle(WHO_COUNTRY_VECTORTILES).then((style: mapboxgl.Style) => {
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
  });
}

const MapboxGLMap = (): any => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [state] = useContext(AppContext);
  const [map, setMap] = useState<mapboxgl.Map | undefined>(undefined);

  // Creates map, only runs once
  useEffect(() => {
    (async () => {
      const baseMapStyle = await getEsriVectorSourceStyle(WHO_BASEMAP);

      const m = new mapboxgl.Map({
        //@ts-ignore
        container: mapContainerRef.current,
        style: baseMapStyle,
        center: [0, 30],
        zoom: 1,
      });

      m.on("load", () => {
        mapOnLoad(m);
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
      <Legend />
    </div>
  );
};

export default MapboxGLMap;
