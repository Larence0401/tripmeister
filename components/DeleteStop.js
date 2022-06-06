import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppContext } from "../store/appContext";
import tw from "tailwind-styled-components";
import getFormattedDate from "../utils/getFormattedDate";
import getEndLocation from "../utils/getEndLocation";
import getStartingLocation from "../utils/getStartingLocation";
import useRecalculateRoute from "../hooks/useRecalculateRoute";
import getRoute from "../utils/getRoute";

// This component not only lets the user delete a stage of the itinerary, but also recalculates the route based on the new stops after deletion.

const DeleteStop = () => {
  const { state, dispatch } = useAppContext();
  const [deleted, setIsDeleted] = useState(false);
  const date = getFormattedDate(state.selectedStopData);
  const end = getEndLocation(state.selectedStopData);
  const start = getStartingLocation(state.selectedStopData);
  const stageDetails = deleted ? "line-through text-gray-600" : "";
  const index = state.selectedStopData[6]["index"];
  const isLastStop = index === state.itinerary.length - 1;
  const route = useRecalculateRoute();
  const [newRoute, setNewRoute] = useState([])

  const deleteStop = () => {
    setIsDeleted(true);
    let newItinerary = [...state.itinerary];
    newItinerary.splice(index, 1);
    if (!isLastStop && index !== 0) patchRoute();
    dispatch({ type: "updateItinerary", payload: newItinerary });
  };

  const patchRoute = () => {
    let nextStop = state.itinerary[index + 1][0];
    let prevStop = state.itinerary[index - 1];
    prevStop.splice(1, 1, nextStop);
    let arr = [...state.itinerary];
    let newItinerary = arr.splice(index - 1, 1, prevStop);
    dispatch({ type: "patchRoute", payload: newItinerary });
  };

  const recalculateRoute = async () => {
    const result = state.itinerary.map(async (el) => {
      const startCoords = el[0]["coordinates"];
      const endCoords = el[1]["coordinates"];
      const coords = await getRoute(startCoords, endCoords);
      return [coords];
    });
    const newRoute = await Promise.all(result);
   setNewRoute(newRoute);
  };

  const handleClick = () => {
    dispatch({ type: "setDeleteView", payload: false });
    dispatch({ type: "setEditView", payload: "directions" });
  };

  const filterRouteSections = () => {
        const arr = state.itinerary.map(stage => {
        const lonFirst = stage?.[0]?.coordinates?.[0].toFixed(2)
        const latFirst = stage?.[0]?.coordinates?.[1].toFixed(2)
        const lonLast = stage?.[1]?.coordinates?.[0].toFixed(2)
        const latLast = stage?.[1]?.coordinates?.[1].toFixed(2)
        return [lonFirst,latFirst,lonLast,latLast]
      })

      const filteredRouteData = []
      newRoute.forEach((el,i) => {
        const lonFirst = el[0].geometry.coordinates[0][0].toFixed(2)
        const latFirst = el[0].geometry.coordinates[0][1].toFixed(2)
        const lonLast = el[0].geometry.coordinates[el[0].geometry.coordinates.length-1][0].toFixed(2)
        const latLast = el[0].geometry.coordinates[el[0].geometry.coordinates.length-1][1].toFixed(2)
        const endPointCoordinates = [lonFirst,latFirst,lonLast,latLast]
        if(arr.some(it => JSON.stringify(it) === JSON.stringify(endPointCoordinates))) filteredRouteData.push(el)

      })
      return filteredRouteData
    // })
  }

useEffect(() => {
  if(state.itinerary.length === state.routeData.length) return
  filterRouteSections()
},[newRoute])

  useEffect(() => {
    recalculateRoute()
  }, [state.itinerary]);

  console.log(state.itinerary)
  console.log(state.routeData)


  return (
    <Wrapper>
      <ArrowBackIcon
        className="self-start mb-4"
        fontSize="large"
        onClick={() => handleClick()}
      />
      <StageDetails
        className={stageDetails}
      >{`${date}, ${start} - ${end}`}</StageDetails>
      <Button disabled={deleted} onClick={() => deleteStop()}>
        Delete
      </Button>
    </Wrapper>
  );
};

export default DeleteStop;

const Wrapper = tw.div`
    relative
    flex
    flex-col
    items-start
    w-full
    h-full`;

const StageDetails = tw.div`
    mt-8
    text-xl
    font-semibold
    self-center
`;

const Button = tw.button`
    px-3
    py-1
    uppercase
    rounded-md
    bg-red-600
    text-white
    text-xl
    font-semibold
    mt-8
    self-center
`;
