import { useEffect } from "react";
import { useAppContext } from "../store/appContext";

const useFetchSearchResults = (input) => {

    const { state, dispatch } = useAppContext();

    const fetchSearchResult = async (input) => {
        const location = input === "starting" ? state.startValue : state.endValue;
        if (location.length < 2) return;
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${process.env.mapbox_key}&autocomplete=true`
        );
        const results = await response.json();
        if (!results) return;
        dispatch({ type: `${input}PointSuggestion`, payload: results.features });
      };
    

useEffect(() => {
        fetchSearchResult(input)
},[])

  return fetchSearchResult
}

export default useFetchSearchResults