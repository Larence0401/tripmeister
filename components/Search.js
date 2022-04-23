import { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAppContext } from "../store/appContext";
import AutocompleteList from "./AutocompleteList";
import getStartingLocation from "../utils/getStartingLocation";
import getEndLocation from "../utils/getEndLocation";
import getRoute from "../utils/getRoute";


const Search = () => {
  const { dispatch, state } = useAppContext();
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [date, setDate] = useState(new Date());
  const accommodation = {accommodation: ""}
  const activities = {activities: []}
  const [focus, setFocus] = useState("");
  const [isUpdated, setIsUpdated] = useState({ start: false, end: false });
  const [updateSubmitted, setUpdateSubmitted] = useState(false);
  const stopData =
    state.itinerary.length === 0
      ? [start, end, date, accommodation, activities]
      : [state.itinerary[state.itinerary.length - 1][1], end, date, accommodation, activities];

  const updatedStart = start ? start : state.selectedStopData[0];
  const updatedEnd = end ? end : state.selectedStopData[1];
  const updatedDate = date ? date : state.selectedStopData[2];
  const updatedStopData = [updatedStart, updatedEnd, updatedDate];

  const startValue =
    state?.editView && focus !=="start" && !start
      ? getStartingLocation(state?.selectedStopData)
      : start
      ? start?.place
      : state?.startValue;

  const endValue =
    state?.editView && focus !== "end"
      ? getEndLocation(state?.selectedStopData)
      : end
      ? end?.place
      : state?.endValue;

  const buttonText = state.editView ? "update stop" : "add stop";

  const handleSubmit = () => {
    if ((!start && !state.selectedStopData) || !end) return;
    console.log("click")
    if (!state.editView) {
      dispatch({ type: "createStage", payload: stopData });
      setEnd(null)
    } 
    if (state.editView) 
    {
      setUpdateSubmitted(true);};
    dispatch({ type: "endValue", payload: "" });
  };

  const updateItinerary = () => {
    const index = state?.selectedStopData?.[3]?.["index"];
    if (!state.selectedStopData) return;
    let arr = updateCurrentStop(index);
    if (index > 0 && state.itinerary.length > 0) {
      const newPrevStop = updateLastStop(index);
      arr.splice(index - 1, 1, newPrevStop);
    }
    if (index < state.itinerary.length - 1) {
      const newNextStop = updateNextStop(index);
      arr.splice(index + 1, 1, newNextStop);
    }
    dispatch({ type: "updateItinerary", payload: arr });
  };

  const updateLastStop = (index) => {
    const newPrevEnd = updatedStopData[0];
    let prevStop = state.itinerary[index - 1];
    prevStop.splice(1, 1, newPrevEnd);
    return prevStop;
  };

  const updateNextStop = (index) => {
    const newNextStart = updatedStopData[1];
    let nextStop = state.itinerary[index + 1];
    nextStop.splice(0, 1, newNextStart);
    return nextStop;
  };

  const updateCurrentStop = (index) => {
    let arr = [...state.itinerary];
    arr.splice(index, 1, updatedStopData);
    return arr;
  };

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

  const recalculateRoute = async() => {
          const result = state.itinerary.map(async(el) => {
            const startCoords = el[0]["coordinates"]
            const endCoords = el[1]["coordinates"]
            const coords = await getRoute(startCoords, endCoords)
            return [coords]
          })
          const newRoute = await Promise.all(result)
          dispatch({type: 'updateRouteData', payload: newRoute})
  }


  console.log(state.routeData)

  useEffect(() => {
    if (start) {
      dispatch({ type: "resetStartSuggestions" });
    }
    if (end) {
      dispatch({ type: "resetEndSuggestions" });
    }
    if (updateSubmitted && (start || end) && state.editView) {
      updateItinerary();
      setStart(null)
      setEnd(null)
    }
  }, [start, end, updateSubmitted]);

  useEffect(() => setFocus(""), [state.selectedStopData]);

  useEffect(() => {
      recalculateRoute()
  },[state.itinerary])

  useEffect(() => {
    fetchSearchResult("starting");
  }, [state.startValue]);

  useEffect(() => {
    fetchSearchResult("end");
  }, [state.endValue]);

  useEffect(() => {
    if (state.editView) {
      setStart(null);
      setEnd(null);
    }
  }, [state.editView]);

  return (
    <Wrapper>
      {state.itinerary.length === 0 || state.editView ? (
        <DestinationInput
          placeholder="starting point"
          value={startValue}
          onChange={(e) =>
            dispatch({ type: "startValue", payload: e.target.value })
          }
          onFocus={() => setFocus("start")}
          onKeyDown={() => setStart(null)}
        />
      ) : (
        <LastStop className="truncate">
          {state?.itinerary?.[state.itinerary.length - 1]?.[1]?.place}
        </LastStop>
      )}

      {focus === "start" && state.startValue.length > 2 && !start && (
        <AutocompleteList setStart={setStart} />
      )}
      <DestinationInput
        placeholder="destination point"
        value={endValue}
        onChange={(e) =>
          dispatch({ type: "endValue", payload: e.target.value })
        }
        onFocus={() => setFocus("end")}
        onKeyDown={() => setEnd(null)}
      />
      {focus === "end" && state.endValue.length > 2 && !end && (
        <AutocompleteList setEnd={setEnd} />
      )}
      <DatePickerContainer>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          showTimeSelect
          dateFormat="dd.MM.yyyy"
        />
      </DatePickerContainer>
      <AddStopButton onClick={handleSubmit}>{buttonText}</AddStopButton>
    </Wrapper>
  );
};

export default Search;

const Wrapper = tw.div`
    rounded-lg
    shadow-md
    box-border
    flex
    flex-col
    items-center
    bg-white
    m-8
    mb-4
    p-8
    h-auto
    w-full`;

const DestinationInput = tw.input`
    rounded-sm
    leading-10
    uppercase
    border
    border-slate-300
    box-border
    mb-4
    px-2
    py-1
    w-full`;

const DatePickerContainer = tw.div`
    rounded-sm
    border
    border-slate-300
    box-border
    leading-10
    mb-8
    px-2
    py-1
    w-full`;

const AddStopButton = tw.button`
    rounded-md
    bg-slate-600
    shadow-md
    box-border
    leading-10
    px-2
    py-1
    text-slate-100
    text-2xl
    uppercase
    align-center
    w-full`;

const SuggestionsWrapper = tw.div`
    px-2
    py-1
    mx-8
    mb-4
    w-full
    truncate
    shadow-md
    flex
    flex-col`;

const ListItem = tw.li`
    px-2
    py-1
    overflow-hidden
    truncate
    hover:bg-slate-50
`;

const LastStop = tw.div`
rounded-sm
font-semibold
leading-10
uppercase
box-border
mb-4
px-2
py-1
w-full
`;
