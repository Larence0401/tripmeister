import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppContext } from "../store/appContext";
import tw from "tailwind-styled-components";
import getFormattedDate from "../utils/getFormattedDate";
import getEndLocation from "../utils/getEndLocation";
import getStartingLocation from "../utils/getStartingLocation";
import getRoute from "../utils/getRoute";

const DeleteStop = () => {
  const { state, dispatch } = useAppContext();
  const [deleted, setIsDeleted] = useState(false);
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [numberOfSections, setNumberOfSections] = useState(0);
  const date = getFormattedDate(state.selectedStopData);
  const end = getEndLocation(state.selectedStopData);
  const start = getStartingLocation(state.selectedStopData);
  const stageDetails = deleted ? "line-through text-gray-600" : "";
  const index = state.selectedStopData[3]["index"];
  const isLastStop = index === state.itinerary.length - 1;

  const deleteStop = () => {
    setIsDeleted(true);
    setNumberOfSections(state.itinerary.length);
    if (!isLastStop && index !== 0) getEndPointCoordinates();
    let newItinerary = [...state.itinerary];
    newItinerary.splice(index, 1);
    let newRoute = [...state.routeData];
    if(isLastStop) {
      newRoute.splice(index - 1, 1)
    } else if(index === 0) {
      newRoute.splice(0, 1)
    } else {newRoute.splice(index - 1, 2)}
    if (!isLastStop && index !== 0) patchRoute();
    dispatch({
      type: "removeStop",
      payload: { newItinerary, newRoute },
    });
  };

  const patchRoute = () => {
    let nextStop = state.itinerary[index + 1][0];
    let prevStop = state.itinerary[index - 1];
    prevStop.splice(1, 1, nextStop);
    let arr = [...state.itinerary];
    let newItinerary = arr.splice(index - 1, 1, prevStop);
    dispatch({ type: "patchRoute", payload: newItinerary });
  };

  const getEndPointCoordinates = () => {
    setStartCoords(state.itinerary[index - 1][0]["coordinates"]);
    setEndCoords(state.itinerary[index + 1][0]["coordinates"]);
  };

  const updateRoute = async () => {
    if (!startCoords || !endCoords) return;
    const geojson = await getRoute(startCoords, endCoords);
    const newArr = [...state.routeData];
    newArr.splice(index - 1, 0, [geojson]);
    dispatch({ type: "recalculateRoute", payload: newArr });
    dispatch({ type: "updateRoute" });
  };

  useEffect( () => {
    if (index === numberOfSections - 1) return;
    updateRoute();
  }, [startCoords, endCoords]);

  return (
    <Wrapper>
      <ArrowBackIcon
        className="self-start mb-4"
        fontSize="large"
        onClick={() => dispatch({ type: "setDeleteView", payload: false })}
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
