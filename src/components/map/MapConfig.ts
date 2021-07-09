import mapboxgl from "mapbox-gl";

export const MapSymbology = {
    StudyFeature: {
        National: {
            Color: '#094180',
            Size: 11
        },
        Regional: {
            Color: '#F19E66',
            Size: 9
        },
        Local: {
            Color: '#E15759',
            Size: 6
        },
        Sublocal: {
            Color: '#E15759',
            Size: 5
        },
        Default: {
            Color: '#FFFFFF',
            Size: 0
        }
    },
    CountryFeature: {
        IsHighlighted: {
            Color: '#b0c8d4'
        },
        HasData: {
            Color: '#97b1bd',
            Opacity: 0.5 
        },
        Disputed: {
            Color: '#E1E1E1',
            Opacity: 1 
        },
        Default: {
            Color: '#FFFFFF',
            Opacity: 0 
        }
    },
    Border: {
        Color: "#455a64"
    }
}

export const MapResources = {
    WHO_BASEMAP : "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/WHO_Polygon_Basemap_no_labels/VectorTileServer",
    WHO_COUNTRY_VECTORTILES : "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/Countries/VectorTileServer"
}

export const DefaultMapboxMapOptions = {
    center: [10, 30],
    zoom: 2,
    minZoom: 2,
    maxZoom: 14,
    attributionControl: false,
    doubleClickZoom: false,
}

export const Expressions = {
    Studies: {
        "circle-color": [
          "match",
          ["get", "estimate_grade"],
          "National",
          MapSymbology.StudyFeature.National.Color,
          "Regional",
          MapSymbology.StudyFeature.Regional.Color,
          "Local",
          MapSymbology.StudyFeature.Local.Color,
          "Sublocal",
          MapSymbology.StudyFeature.Sublocal.Color,
          MapSymbology.StudyFeature.Default.Color,
        ],
        "circle-radius": [
          "match",
          ["get", "estimate_grade"],
          "National",
          MapSymbology.StudyFeature.National.Size,
          "Regional",
          MapSymbology.StudyFeature.Regional.Size,
          "Local",
          MapSymbology.StudyFeature.Local.Size,
          "Sublocal",
          MapSymbology.StudyFeature.Sublocal.Size,
          MapSymbology.StudyFeature.Default.Size,
        ],
        'circle-stroke-width': 1,
        'circle-stroke-opacity': [
            'case',
            ['boolean', ['feature-state', 'isSelected'], false],
            1,
            0
        ],
        'circle-opacity': [
            'case',
            ['boolean', ['feature-state', 'isBlurred'], false],
            0.2,
            0.6
        ]
      },

      Countries : {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'isHighlighted'], true], MapSymbology.CountryFeature.IsHighlighted.Color,
          ['boolean', ['feature-state', 'hasData'], true], MapSymbology.CountryFeature.HasData.Color,
          MapSymbology.CountryFeature.Default.Color
        ],
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hasData'], false],
          MapSymbology.CountryFeature.HasData.Opacity,
          MapSymbology.CountryFeature.Default.Opacity
        ]
      }
}