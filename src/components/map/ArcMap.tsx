import React from "react";
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer'
import '@arcgis/core/assets/esri/themes/dark/main.css';
import config from '@arcgis/core/config.js';

// Assets have been moved from the default location
//config.assetsPath = '/public/assets';
config.apiKey = "AAPKa8fc519357f34332a7101c24fd428bd7qrZNoFTp0NhABQN23dxAn-hSRRSwvkgKiN-CLOH--hru1Jd-9_mFM9LjxD4qIWdc";

interface state {
    lng: number,
    lat: number,
    zoom: number
}

class ArcMap extends React.Component {
    mapContainer: string | HTMLElement = "";
    state: state;

    constructor(props: any) {
        super(props);
        this.state = {
            lng: 5,
            lat: 34,
            zoom: 2,
        };
    }

    componentDidMount() {
        var map = new WebMap();

        var view = new MapView({
          container: "viewDiv",
          map: map,
          center: [-98.5795, 39.8282],
          zoom: 3
        });

        var baseLayer = new VectorTileLayer({
          url:
            "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/WHO_Polygon_Basemap_no_labels/VectorTileServer"
        });

        var countryPolygonLayer = new VectorTileLayer({
          url:
            "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/Countries/VectorTileServer"
        });

        var disputedLayer = new VectorTileLayer({
          url:
            "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/WHO_Polygon_Basemap_Disputed_Areas_and_Borders_VTP/VectorTileServer"
        });
        map.add(baseLayer);
        map.add(countryPolygonLayer);
        map.add(disputedLayer);
    }

    render() {
        return (
            <div className="mapContainer w-100" id="viewDiv"/>
        );
    }
}

export default ArcMap;