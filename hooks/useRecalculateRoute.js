import { useEffect, useState } from "react";
import { useAppContext } from "../store/appContext";
import getRoute from "../utils/getRoute";

const useRecalculateRoute = () => {
  const { state, dispatch } = useAppContext();
  const [route,setRoute] = useState([])

    const recalculateRoute = async () => {
      const result = state.itinerary.map(async (el) => {
        const startCoords = el[0]["coordinates"];
        const endCoords = el[1]["coordinates"];
        const coords = await getRoute(startCoords, endCoords);
        return [coords];
      });
      const newRoute = await Promise.all(result);
      dispatch({ type: "updateRouteData", payload: newRoute });
    };

    useEffect(() => {
      recalculateRoute()
    },[])

    return recalculateRoute
};

export default useRecalculateRoute;
