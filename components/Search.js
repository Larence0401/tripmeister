import { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAppContext } from "../store/appContext";
import AutocompleteList from "./AutocompleteList";
import getStartingLocation from "../utils/getStartingLocation";
import getEndLocation from "../utils/getEndLocation";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import HotelIcon from "@mui/icons-material/Hotel";
import useGetRoute from "../hooks/useGetRoute";

const Search = () => {
  const { dispatch, state } = useAppContext();
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [newDate, setNewDate] = useState(new Date());
  const [dateUpdated, setDateUpdated] = useState(false)
  const getRoute = useGetRoute();
  const accommodation = state.itinerary?.[3]?.id
    ? state.itinerary?.[3]
    : { accommodation_test: "" };
  const activities = { activities: [] };
  const [focus, setFocus] = useState("");
  const [stayOvernight, setStayOvernight] = useState({ stayOvernight: true });
  const [updateSubmitted, setUpdateSubmitted] = useState(false);
  const bedColor = stayOvernight.stayOvernight
    ? "text-blue-500"
    : "text-gray-500";
  const dateInput = end ? "w-2/3" : "w-full";
  const stopData =
    state.itinerary.length === 0
      ? [start, end, newDate, accommodation, activities, stayOvernight]
      : [
          state.itinerary[state.itinerary.length - 1][1],
          end,
          newDate,
          accommodation,
          activities,
          stayOvernight,
        ];

  const updatedStart = start ? start : state.selectedStopData[0];
  const updatedEnd = end ? end : state.selectedStopData[1];
  const updatedDate = newDate;
  const updatedStopData = [
    updatedStart,
    updatedEnd,
    updatedDate,
    { accommodation: "" },
    { activities: [] },
    { stayOvernight: true },
  ];
  const isStayOvernight =
    state.itinerary?.[state.itinerary?.length - 1]?.[5]?.stayOvernight;

  const slideIn = state.sidebarIsOpen
    ? "translate-x-[250px] duration-300 ease-in-out"
    : "-translate-x-0 duration-300 ease-in-out";

  const startValue =
    state?.editView && focus !== "start" && !start
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
    if (!state.editView) {
      dispatch({ type: "createStage", payload: stopData });
      setEnd(null);
    }
    if (state.editView) {
      setUpdateSubmitted(true);
    }
    dispatch({ type: "endValue", payload: "" });
  };

  const updateItinerary = () => {
    const index = state?.selectedStopData?.[6]?.["index"];
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

const handleDateChange = (date) => {
    setNewDate(date)
    setDateUpdated(true)
    setUpdateSubmitted(true)
}

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
    if (start) {
      dispatch({ type: "resetStartSuggestions" });
    }
    if (end) {
      dispatch({ type: "resetEndSuggestions" });
    }
    if (
      updateSubmitted &&
      (start || end || dateUpdated) &&
      state.editView
    ) {
      updateItinerary();
      setStart(null);
      setEnd(null);
      setDateUpdated(false);
    }
  }, [start, end, updateSubmitted, dateUpdated]);

  useEffect(() => setFocus(""), [state.selectedStopData]);

  useEffect(() => {
    recalculateRoute();
  }, [state.itinerary]);

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

  useEffect(() => {
    if (!isStayOvernight) return;
    let dateOld = newDate.getTime();
    const datePlus = dateOld + 3600 * 24 * 1000;
    const date = new Date(datePlus);
    setNewDate(date);
  }, [state.itinerary.length]);


  return (
    <Wrapper className={slideIn}>
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
      <div className="flex w-full items-center mb-4 hover:mb-8 justify-between">
        <DatePickerContainer className={dateInput}>
          <DatePicker
            portalId="root-portal"
            className="w-3/4 z-50"
            selected={newDate}
            onChange={(date) => handleDateChange(date)}
            showTimeSelect
            dateFormat="dd.MM.yyyy"
          />
        </DatePickerContainer>
        {stayOvernight.stayOvernight && end ? (
          <ToggleOnIcon
            fontSize="large"
            className="text-blue-500"
            onClick={() =>
              setStayOvernight((prev) => {
                return { stayOvernight: !prev.stayOvernight };
              })
            }
          />
        ) : !stayOvernight.stayOvernight && end ? (
          <ToggleOffIcon
            fontSize="large"
            className="text-gray-500"
            onClick={() =>
              setStayOvernight((prev) => {
                return { stayOvernight: !prev.stayOvernight };
              })
            }
          />
        ) : null}
        {end && <HotelIcon fontSize="large" className={bedColor} />}
      </div>

      <AddStopButton onClick={handleSubmit} disabled={!end}>
        {buttonText}
      </AddStopButton>
    </Wrapper>
  );
};

export default Search;

const Wrapper = tw.div`
    z-50
    rounded-lg
    shadow-md
    box-border
    flex
    flex-col
    items-center
    bg-white
    m-4
    md:m-8
    mx-0
    lg:m-0
    lg:mb-4
    lg-mt-8
    mb-4
    p-4
    md:p-8
    h-auto
    lg:z-10
    w-full`;

const DestinationInput = tw.input`
    rounded-sm
    leading-8
    md:leading-10
    uppercase
    border
    border-slate-300
    box-border
    mb-2
    md:mb-4
    px-2
    py-0
    md:py-1
    w-full`;

const DatePickerContainer = tw.div`
    rounded-sm
    flex
    border
    border-slate-300
    self-start
    box-border
    leading-8
    md:leading-10
    px-2
    pr-2
    py-0
    md:py-1
`;

const AddStopButton = tw.button`
    rounded-md
    bg-slate-600
    shadow-md
    box-border
    leading-8
    md:leading-10
    px-2
    py-1
    text-slate-100
    text-xl
    md:text-2xl
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
leading-8
md:leading-10
uppercase
box-border
mb-2
md:mb-4
px-2
w-full
`;
