import { useAppContext } from "../store/appContext";

const useFetchSuggestions = async(start,stop) => {
    const { state, dispatch } = useAppContext()
    const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${stop[0]},${stop[1]}?steps=true&geometries=geojson&access_token=${process.env.mapbox_key}`,
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
      return (
        geojson
      )
}

export default useFetchSuggestions