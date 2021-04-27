import { useState, useEffect, useContext } from "react"
import { AppContext } from "context";
import ReactDOMServer from "react-dom/server";
import { EstimateGradePrevalence } from "types";
import mapboxgl from "mapbox-gl";
import CountryPopup from 'components/map/Popups/CountryPopup'

// Maps estimate grade prevalence data to a match ISO3 code in the countries feature layer
function SetCountryEstimates(map: mapboxgl.Map, estimateGradePrevalences: EstimateGradePrevalence[]) {
    estimateGradePrevalences.forEach((country: EstimateGradePrevalence) => {
        if (country && country.testsAdministered && country.alpha3Code) {
            map.setFeatureState(
                {
                    source: "Countries",
                    sourceLayer: "Countries",
                    id: country.alpha3Code,
                },
                {
                    hasData: true,
                    testsAdministered: country.testsAdministered,
                    geographicalName: country.geographicalName,
                    numberOfStudies: country.numberOfStudies,
                    localEstimate: country.localEstimate,
                    nationalEstimate: country.nationalEstimate,
                    regionalEstimate: country.regionalEstimate,
                    sublocalEstimate: country.sublocalEstimate,
                }
            );
        }
    });
}

// Filters out Country features based on their existance within the new estimate grade prevalences
function FilterCountryEstimates(map: mapboxgl.Map, estimateGradePrevalences: EstimateGradePrevalence[]) {
    const onlyIso3: (string | null)[] = estimateGradePrevalences.map((c) => { return c.alpha3Code })

    if (map.getLayer("Countries") && map.isSourceLoaded('Countries')) {
        map?.setFilter('Countries',
            ["in",
                ["get", 'CODE'],
                ["literal", onlyIso3]
            ]);
    }
    else { // If countries has not been loaded, wait until it's source has finished.
        map.on('sourcedata', function (e: any) {
            if (e.sourceId === 'Countries' && map.isSourceLoaded('Countries')) {
                map?.setFilter('Countries',
                    ["in",
                        ["get", 'CODE'],
                        ["literal", onlyIso3]
                    ]);
            }
        });
    }
}

const Countries = (map: mapboxgl.Map | undefined, estimateGradePrevalences: EstimateGradePrevalence[]) => {

    const [state] = useContext(AppContext);
    const [popup, setPopup] = useState<mapboxgl.Popup | undefined>(undefined);
    const [currentFeatureId, setCurrentFeatureId] = useState<string | undefined>(undefined);

    // If estimates are updated, waits until map is loaded then maps estimate data to country features
    useEffect(() => {
        if (estimateGradePrevalences.length > 0 && map && map.getSource('Countries')) {
            SetCountryEstimates(map, estimateGradePrevalences);
        }
        else if (map) {
            map.on('sourcedata', function (e: any) {
                if (e.sourceId === 'Countries' && map.isSourceLoaded('Countries')) {
                    SetCountryEstimates(map, estimateGradePrevalences);
                }
            });
        }
    }, [estimateGradePrevalences, map]);

    // If estimates are updated, waits until map is loaded then filters country features
    useEffect(() => {
        if (estimateGradePrevalences.length > 0 && map) {
            FilterCountryEstimates(map, estimateGradePrevalences)
        }
    }, [estimateGradePrevalences, map]);

    // wait until map is loaded then creates and binds popup to map events
    useEffect(() => {
        if (map && popup === undefined) {
            const countryPop = new mapboxgl.Popup({ offset: 25, className: "pin-popup", closeButton: false });

            map.on("mouseenter", "Countries", function (e: any) {
                if (e.features[0].state.hasData) {
                    countryPop.setMaxWidth("250px")
                        .setHTML(ReactDOMServer.renderToString(CountryPopup(e.features[0], state.language)))
                        .setLngLat(e.lngLat)
                        //.trackPointer()
                        .addTo(map);
                }
            });

            map.on("mouseleave", "Countries", function (e: any) {
                if (countryPop.isOpen()) {
                    countryPop
                    .remove()
                }
            });

            map.on("mousedown", "Countries", function (e: any) {
                if (e) {

                    var features = map.querySourceFeatures('your-source-id', {
                        sourceLayer: 'your-source-layer'
                        });
                }
            });

            map.on("mousemove", "Countries", function (e: any) {
                const f = e.features[0];
                if (f.state.hasData && f.id !== currentFeatureId && countryPop.isOpen()) {
                    countryPop
                    .setLngLat(e.lngLat)
                    .setHTML(ReactDOMServer.renderToString(CountryPopup(e.features[0], state.language)))
                    setCurrentFeatureId(f.id);
                }
            });

            setPopup(countryPop);
        }
    }, [map, state.language, popup, currentFeatureId])

    useEffect(()=>{
        if(popup !== undefined){
            if (state.showCountryHover){
                popup.removeClassName("disable-popup")
            }
            else
            {
                popup.addClassName("disable-popup")
            }
        }
    }, [popup, state.showCountryHover])

    return;
}

export default Countries;