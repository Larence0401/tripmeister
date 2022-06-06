import { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import { format } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAppContext } from "../store/appContext";
import getFormattedTime from "../utils/getFormattedTime";
import getRideDetails from "../utils/getRideDetails";

const ItineraryItem = ({ item, index }) => {
  const { state, dispatch } = useAppContext();
  const startingpoint = item[0].place.split(",")[0];
  const destinationpoint = item[1].place.split(",")[0];
  const startCoords = state?.itinerary[index][0].coordinates;
  const endCoords = state?.itinerary[index][1].coordinates;
  const formattedTime = format(item[2], "dd MMM");
  const [rideDetails, setRideDetails] = useState("");
  const duration =
    rideDetails !== "" ? getFormattedTime(rideDetails.duration) : "";
  const distance =
    rideDetails !== "" ? Math.floor(rideDetails.distance / 1000) + " km" : "";
  const leftCol = state?.itinerary?.[index]?.[5]?.["stayOvernight"]
    ? formattedTime
    : "(stopover)";
  const cursor = state.readingMode ? "cursor-pointer" : "";

  const selectedStyle =
    state?.selectedStopData?.[6]?.["index"] === index &&
    (state.editView || state.readingMode)
      ? "italic font-semibold"
      : "";

  const handleClick = (action) => {
    const type = action === "delete" ? "setDeleteView" : "setEditView";
    dispatch({ type, payload: true });
    dispatch({ type: "setEditViewType", payload: "directions" });
    dispatch({ type: "selectStop", payload: [...item, { index: index }] });
    dispatch({ type: "startValue", payload: "" });
    dispatch({ type: "endValue", payload: "" });
  };

  useEffect(() => {
    (async () => {
      const details = await getRideDetails(startCoords, endCoords);
      setRideDetails(details);
    })();
  }, []);

  return (
    <Wrapper
      id="itinerary_item"
      className={`${cursor}`}
      onClick={() => (state.readingMode ? handleClick("edit") : null)}
    >
      <Date className={selectedStyle}>{leftCol}</Date>
      <Route className={`${selectedStyle} truncate`}>
        {`${startingpoint} - ${destinationpoint}`}
      </Route>
      {state.readingMode && <Details>{`${duration} / ${distance}`}</Details>}
      {!state.readingMode && (
        <Icons>
          <EditIcon
            fontSize="small"
            className={`text-slate-700 hover:text-slate-900 mr-1 cursor-pointer`}
            onClick={() => handleClick("edit")}
          />
          <DeleteIcon
            fontSize="small"
            className={`text-slate-700 hover:text-slate-900 cursor-pointer`}
            onClick={() => handleClick("delete")}
          />
        </Icons>
      )}
    </Wrapper>
  );
};

export default ItineraryItem;

const Wrapper = tw.div`
    text-sm
    md:text-base
    bg-white
    border-b
    border-slate-300
    py-2
    md:py-4
    px-2
    flex
    w-full
`;

const Route = tw.div`
flex-1
`;
const Date = tw.div`
w-1/4
`;

const Icons = tw.div`
`;

const Details = tw.div`
`;
