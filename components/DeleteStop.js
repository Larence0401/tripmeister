import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppContext } from "../store/appContext";
import tw from "tailwind-styled-components";
import getFormattedDate from "../utils/getFormattedDate";
import getEndLocation from "../utils/getEndLocation";
import getStartingLocation from "../utils/getStartingLocation";

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

  const handleClick = () => {
    dispatch({ type: "setDeleteView", payload: false });
    dispatch({ type: "setEditView", payload: "directions" });
  };

  return (
    <Wrapper>
      <ArrowBackIcon
        className="self-start mb-4 cursor-pointer text-slate-700 hover:text-slate-900"
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
