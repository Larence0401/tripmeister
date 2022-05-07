import { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import AutocompleteList from "./AutocompleteList";
import useFetchSearchResults from "../hooks/useFetchSearchResults";
import CheckIcon from "@mui/icons-material/Check";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

const HotelSearch = () => {
  const { dispatch, state } = useAppContext();
  const [start, setStart] = useState(null);
  const fetchSearchResult = useFetchSearchResults("starting");
  const inputValue = start ? start?.place : state.startValue;
  console.log(state.selectedStopData);
  console.log(state.itinerary)
  const checkIcon = state.startValue.length < 4 ? "" : <CheckIcon onClick={() => updateHotel()}/>;
  

  const updateHotel = () => {
    const newHotel = start ? start : state.startValue
    const index = state.selectedStopData[5]["index"]
    const arr = [...state.itinerary]
    arr[index].splice(3,1,newHotel)
    dispatch({type: "updateItinerary", payload: arr})
  };

  useEffect(() => {
    fetchSearchResult("starting");
  }, [state.startValue]);

  return (
    <>
      {/* <Input
        placeholder="search hotel"
        value={inputValue}
        onChange={(e) =>
          dispatch({ type: "startValue", payload: e.target.value })
        }
        onKeyDown={() => setStart(null)}
      /> */}
      <TextField
        size="small"
        placeholder="search hotel"
        value={inputValue}
        onChange={(e) =>
          dispatch({ type: "startValue", payload: e.target.value })
        }
        onKeyDown={() => setStart(null)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">{checkIcon}</InputAdornment>
          ),
        }}
      />
      {state.startValue.length > 2 && !start && (
        <AutocompleteList setStart={setStart} />
      )}
    </>
  );
};

export default HotelSearch;

const Input = tw.input`
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
