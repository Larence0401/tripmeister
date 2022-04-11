import { useEffect, useState, useRef } from "react";
import tw from "tailwind-styled-components";
import Map, { Marker, Source, Layer } from "react-map-gl";
import { useAppContext } from "../store/appContext";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import ViewListIcon from "@mui/icons-material/ViewList";
import MapIcon from "@mui/icons-material/Map";

const MapComponent = () => {
  const { state, dispatch } = useAppContext();
  const [routeData, setRouteData] = useState("");
  const [zoomedOut, setZoomedOut] = useState(false);
  const [isListView, setIsListView] = useState(false);
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
    width: "100%",
    height: "100%",
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
    dispatch({ type: "storeRouteData", payload: [geojson] });
  };

  const getCoordinates = (type) => {
    if (state.itinerary.length < 1) return;
    const index = type === "lat" ? 1 : 0;
    const arr = [...state.itinerary];
    const array = [];
    let coordinates_array = arr.map((stage) => [
      ...array,
      stage[1]["coordinates"][index],
    ]);
    coordinates_array = [
      ...coordinates_array,
      [state.itinerary[0][0]["coordinates"][index]],
    ];
    return coordinates_array;
  };

  const getFitBounds = () => {
    if (state.itinerary.length < 1) return;
    const latitudes_array = getCoordinates("lat");
    const longitudes_array = getCoordinates("long");
    const minLat = latitudes_array.sort()[0];
    const maxLat = latitudes_array.sort().reverse()[0];
    const minLong = longitudes_array.sort()[0];
    const maxLong = longitudes_array.sort().reverse()[0];
    const fitBounds = [
      [...maxLong, ...maxLat],
      [...minLong, ...minLat],
    ];
    return fitBounds;
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
    const fitBounds =
      zoomedOut && state.itinerary.length > 0
        ? getFitBounds()
        : [marker1, marker2];
    mapRef.current?.fitBounds(fitBounds, { padding: 60 });
  }, [state.itinerary, zoomedOut]);

  const StartMarkerProps = {
    longitude: state.itinerary[0]?.[0]["coordinates"][0],
    latitude: state.itinerary[0]?.[0]["coordinates"][1],
  };

  const markers =
    state.itinerary.length > 0
      ? state.itinerary.map((stop, index) => (
          <Marker
            longitude={stop[1]["coordinates"][0]}
            latitude={stop[1]["coordinates"][1]}
            key={index}
          />
        ))
      : null;

  const routes =
    state.routeData.length > 0
      ? state.routeData.map((route, index) => (
          <Source
            id={index.toString()}
            type="geojson"
            data={route[0]}
            key={index}
          >
            <Layer type="line" />
          </Source>
        ))
      : null;

      console.log(state.routeData)
      console.log(state.itinerary?.[0]?.[2])


  return (
    <Wrapper>
      <Map
        className="relative"
        ref={mapRef}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.mapbox_key}
        {...viewstate}
        onMove={(e) => setViewState(e.viewState)}
      >
        {zoomedOut ? (
          <ZoomInMapIcon
            className="absolute m-4 z-90 text-slate-900 rounded-md"
            fontSize="large"
            onClick={() => setZoomedOut(false)}
          />
        ) : (
          <ZoomOutMapIcon
            className="absolute m-4 z-90 bg-white/[.06] rounded-md"
            fontSize="large"
            onClick={() => setZoomedOut(true)}
          />
        )}
        {!isListView ? (
          <ViewListIcon
            className="absolute right-0 m-4 text-slate-900"
            fontSize="large"
            onClick={() => dispatch({type: 'setMapView', payload: false})}
          />
        ) : (
          <MapIcon
            className="absolute right-0 m-4 text-slate-900"
            fontSize="large"
            onClick={() => dispatch({type: 'setMapView', payload: true})}
          />
        )}
        {state.itinerary.length > 0 && <Marker {...StartMarkerProps} />}
        {markers}
        {routes}
      </Map>
    </Wrapper>
  );
};

export default MapComponent;

const Wrapper = tw.div`
    flex
    relative
    w-full
    h-full
    mx-8`;
