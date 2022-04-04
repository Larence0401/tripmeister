import { useEffect, useState, useRef } from "react";
import tw from "tailwind-styled-components";
import Map, { Marker, Source, Layer } from "react-map-gl";
import { useAppContext } from "../store/appContext";

const MapComponent = () => {
  const { state, dispatch } = useAppContext();
  const [routeData, setRouteData] = useState("");
  const mapRef = useRef();
  const marker2 =
    state.itinerary?.length > 0
      ? state.itinerary[state.itinerary.length - 1][1]["coordinates"]
      : null;

  const marker1 =
    state.itinerary?.length > 0
      ? state.itinerary[state.itinerary.length - 1][0]["coordinates"]
      : null;

  const [viewstate, setViewState] = useState({
    latitude: "52.5200",
    longitude: "13.4050",
    zoom: 7,
  });

  const fetchSearchResult = async (input) => {
    const location = input === "starting" ? state.startValue : state.endValue;

    if (state.startValue.length < 2) return;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${process.env.mapbox_key}&autocomplete=true`
    );
    const results = await response.json();
    if (!results) return;
    dispatch({ type: `${input}PointSuggestion`, payload: results.features });
  };

  const getRoute = async () => {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${marker1[0]},${marker1[1]};${marker2[0]},${marker2[1]}?steps=true&geometries=geojson&access_token=${process.env.mapbox_key}`,
      { method: "GET" }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: route,
      },
    };
    setRouteData(geojson);
  };

  const paintRoute = () => {
    const routeLayer = {
      id: "route",
      type: "line",
      source: {
        type: "geojson",
        data: routeData,
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#3887be",
        "line-width": 5,
        "line-opacity": 0.75,
      },
    };
  };

  useEffect(() => {
    fetchSearchResult("starting");
  }, [state.startValue]);

  useEffect(() => {
    fetchSearchResult("end");
  }, [state.endValue]);

  useEffect(() => {
    if (state.itinerary.length === 0) return;
    getRoute();
    mapRef.current.fitBounds([marker1, marker2], { padding: 60 });
  }, [state.itinerary]);

  useEffect(() => {
    console.log(routeData);
  }, [routeData]);

  return (
    <Wrapper>
      <Map
        ref={mapRef}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.mapbox_key}
        {...viewstate}
        width="100%"
        height="100%"
        onMove={(evt) => setViewState(evt.viewState)}
      >
        {marker2 ? (
          <Marker latitude={marker2[1]} longitude={marker2[0]} />
        ) : null}
        {marker1 ? (
          <Marker latitude={marker1[1]} longitude={marker1[0]} />
        ) : null}
        {routeData && (
          <Source id="polylineLayer" type="geojson" data={routeData}>
            <Layer type="line"/>
          </Source>
        )}
      </Map>
    </Wrapper>
  );
};

export default MapComponent;

const Wrapper = tw.div`
    flex

    w-full
    h-full
    mx-8`;
