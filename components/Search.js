import { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAppContext } from "../store/appContext";
import AutocompleteList from "./AutocompleteList";

const Search = () => {
  const { dispatch, state } = useAppContext();
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [date, setDate] = useState(new Date());
  const [focus, setFocus] = useState("");
  const stopData =
    state.itinerary.length === 0
      ? [start, end, date]
      : [
          state.itinerary[state.itinerary.length - 1][1],
          end,
          date,
        ];

  const handleSubmit = () => {
    if (!start || !end) return;
    dispatch({ type: "createStage", payload: stopData });
    setEnd(null);
    dispatch({ type: "endValue", payload: "" });
  };

  useEffect(() => {
    if (start) {
      dispatch({ type: "resetStartSuggestions" });
    }
    if (end) {
      dispatch({ type: "resetEndSuggestions" });
    }
  }, [start, end]);

  console.log(state.itinerary);

  return (
    <Wrapper>
      {state.itinerary.length === 0 ? (
        <DestinationInput
          placeholder="starting point"
          value={start ? start.place : state.startValue}
          onChange={(e) =>
            dispatch({ type: "startValue", payload: e.target.value })
          }
          onFocus={() => setFocus("start")}
          onKeyDown={() => setStart(null)}
        />
      ) : (
        <LastStop>
          {state.itinerary[state.itinerary.length - 1][1].place}
        </LastStop>
      )}

      {focus === "start" && state.startValue.length > 2 && !start && (
        <AutocompleteList setStart={setStart} />
      )}
      <DestinationInput
        placeholder="destination point"
        value={end ? end.place : state.endValue}
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
        />
      </DatePickerContainer>
      <AddStopButton onClick={handleSubmit}>Add Stop</AddStopButton>
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
