import { useEffect, useState, useRef } from "react";
import tw from "tailwind-styled-components";
import Map, { Marker, Source, Layer } from "react-map-gl";
import { useAppContext } from "../store/appContext";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import ViewListIcon from "@mui/icons-material/ViewList";
import MapIcon from "@mui/icons-material/Map";
import useMapFeatures from "../hooks/useMapFeatures";
import useSortFeaturesByDistance from "../hooks/useSortFeaturesByDistance";
import getColors from "../utils/getColors";

const MapComponent = () => {
  const { state, dispatch } = useAppContext();
  const [zoomedOut, setZoomedOut] = useState(false);
  const [hotelSelected, setHotelSelected] = useState(false);
  const mapRef = useRef();
  const [features, mapFeatures] = useMapFeatures();
  console.log(hotelSelected);

  const getMarkers = (no) => {
    if (state.itinerary?.length < 1) return;
    const coords =
      state.selectedStopData.length === 0
        ? state.itinerary[state.itinerary.length - 1][no - 1].coordinates
        : state?.selectedStopData?.[no - 1]?.coordinates;
    return coords;
  };

  const marker1 = getMarkers(1);
  const marker2 = getMarkers(2);

  const [viewstate, setViewState] = useState({
    latitude: "52.5200",
    longitude: "13.4050",
    zoom: 7,
    width: "100%",
    height: "100%",
  });

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

    dispatch({ type: "storeRouteData", payload: [geojson] });
  };

  const getMarkerColor = (stop) =>
    stop?.[5]?.stayOvernight ? "bg-green-300" : "";

  const getCoordinates = (type) => {
    if (state.itinerary.length < 1) return;
    const index = type === "lat" ? 1 : 0;
    const arr =
      state.editViewType === "hotel" && state.editView
        ? [...state.hotelData]
        : state.editViewType === "restaurants"
        ? [...state.restaurantData]
        : [...state.itinerary];
    console.log(arr);

    const array = [];
    let coordinates_array = arr.map((el) => {
      return (state.editViewType !== "hotel" &&
        state.editViewType !== "restaurants") ||
        !state.editView
        ? [...array, el[1]["coordinates"][index]]
        : [...array, el.center[index]];
    });
    coordinates_array =
      (state.editViewType !== "hotel" &&
        state.editViewType !== "restaurants") ||
      !state.editView
        ? [...coordinates_array, [state.itinerary[0][0]["coordinates"][index]]]
        : coordinates_array;
    return coordinates_array;
  };

  const getFitBounds = () => {
    console.log("getFitbounds");
    if (state.itinerary.length < 1) return;
    console.log("getFitbounds after");
    const latitudes_array = getCoordinates("lat");
    const longitudes_array = getCoordinates("long");
    const minLat = latitudes_array.sort()[0];
    const maxLat = latitudes_array.sort().reverse()[0];
    const minLong = longitudes_array.sort()[0];
    const maxLong = longitudes_array.sort().reverse()[0];
    const val =
      window.innerWidth >= 1024
        ? getDesktopFitBounds(minLong, maxLong)
        : minLong;
    const fitBounds = [
      [...maxLong, ...maxLat],
      [val, ...minLat],
    ];
    return fitBounds;
  };

  const getDesktopFitBounds = (minLong, maxLong) => {
    const newMinLong = minLong - (maxLong - minLong) / 2.5;
    return newMinLong;
  };

  const checkIfHotelSelected = () => {
    const index = state?.selectedStopData?.[6]?.["index"];
    state?.itinerary?.[index]?.[3]?.id
      ? setHotelSelected(true)
      : setHotelSelected(false);
  };

  useEffect(() => {
    if (state.editViewType === "hotel" && state.hotelData.length < 1) return;
    if (state.editViewType === "restaurants" && state.restaurantData.length < 1)
      return;
    if (state.itinerary.length === 0) return;
    getRoute();
    const phantomMarkers = modifyFitBounds();
    const markerPair =
      window.innerWidth >= 1024 ? phantomMarkers : [marker1, marker2];
    const fitBounds =
      (zoomedOut && state.itinerary.length > 0) ||
      state.editViewType === "hotel" ||
      state.editViewType === "restaurants"
        ? getFitBounds()
        : markerPair;
    console.log(phantomMarkers);
    console.log(fitBounds);
    console.log(marker1);
    console.log(marker2);
    console.log(hotelSelected);
    mapRef.current?.fitBounds(fitBounds, { padding: 60 });
    modifyFitBounds();
    checkIfHotelSelected();
  }, [
    state.itinerary,
    zoomedOut,
    state.selectedStopData,
    state.editViewType,
    state.hotelData,
    state.restaurantData,
    state.editView,
  ]);

  const StartMarkerProps = {
    color: "#000000",
    longitude: state.itinerary[0]?.[0]["coordinates"][0],
    latitude: state.itinerary[0]?.[0]["coordinates"][1],
  };

  const modifyFitBounds = () => {
    const isToEast = marker1[0] - marker2[0] < 0 ? true : false;
    if (isToEast) {
      const newLong1 = marker1[0] + (marker1[0] - marker2[0]) / 2.5;
      const phantomMarker1 = [newLong1, marker1[1]];
      const markers1 = [phantomMarker1, marker2];
      return markers1;
    } else {
      const newLong2 = marker2[0] - (marker1[0] - marker2[0]) / 2.5;
      const phantomMarker2 = [newLong2, marker2[1]];
      const markers2 = [marker1, phantomMarker2];
      return markers2;
    }
  };

  const mapSelectedHotel = () => {
    const index = state?.selectedStopData?.[6]?.["index"];
    const lon = state?.itinerary?.[index]?.[3]?.center?.[0];
    const lat = state?.itinerary?.[index]?.[3]?.center?.[1];
    const colors = getColors();
    return <Marker color={colors[0]} longitude={lon} latitude={lat} />;
  };

  const markers =
    state.itinerary.length > 0
      ? state.itinerary.map((stop, index) => (
          <Marker
            color={getMarkerColor(stop)}
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

  useEffect(() => {
    if (!state.sortedFeatures || state.sortedFeatures.length < 1) return;
    mapFeatures(hotelSelected);
    // if(state.hotelData.length > 0) setHotelSelected(false)
  }, [
    state.editViewType,
    state.mapView,
    state.sortedFeatures,
    hotelSelected,
    state.hotelSelected,
    state.hotelDeleted
  ]);

  return (
    <Wrapper>
      <Map
        className="relative"
        id="map"
        ref={mapRef}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.mapbox_key}
        {...viewstate}
        onMove={(e) => setViewState(e.viewState)}
        onViewportchange={(e) => setViewState(e.viewState)}
      >
        {zoomedOut ? (
          <ZoomInMapIcon
            className="absolute m-4 lg:m-8 z-90 text-slate-900 rounded-md lg:right-0"
            fontSize="large"
            onClick={() => setZoomedOut(false)}
          />
        ) : (
          <ZoomOutMapIcon
            className="absolute m-4 lg:m-8 z-90 bg-white/[.06] rounded-md lg:right-0"
            fontSize="large"
            onClick={() => setZoomedOut(true)}
          />
        )}
        {state.mapView ? (
          <div className="lg:hidden">
            <ViewListIcon
              className="absolute right-0 m-4 text-slate-900"
              fontSize="large"
              onClick={() => dispatch({ type: "setMapView", payload: false })}
            />
          </div>
        ) : (
          <MapIcon
            className="absolute right-0 m-4 text-slate-900"
            fontSize="large"
            onClick={() => dispatch({ type: "setMapView", payload: true })}
          />
        )}
        {state.itinerary.length > 0 && <Marker {...StartMarkerProps} />}
        {markers}
        {routes}
        {!hotelSelected && features}
        {hotelSelected &&
          state.editViewType === "hotel" &&
          state.hotelData.length > 1 &&
          mapSelectedHotel()}
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
    mt-0
    md:mt-4
    lg:mt-0
    mx-8
    lg:mx-0
    rounded-lg
    overflow-hidden
    `;
