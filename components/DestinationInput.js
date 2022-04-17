import { useState, useEffect } from "react";
import { useAppContext } from "../store/appContext";
import tw from "tailwind-styled-components";
import AutocompleteList from "./AutocompleteList";
import getStartingLocation from "../utils/getStartingLocation";

const DestinationInput = ({ inputType, setIsInputField}) => {
  const { state, dispatch } = useAppContext();
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const startingValue = start?.place?.split(",")[0];
  const endValue = end?.place?.split(",")[0];
  const obj = { startField: false, endField: false, dateField: false };
  if(start) console.log(start);

  useEffect(() => {
    if (!start && !end) return;
    setIsInputField(obj);
    if(start) dispatch({type: 'setStartingPoint', payload: startingValue})
    if(end) dispatch({type: 'setEndPoint', payload: endValue})
    dispatch({type: 'startValue', payload: ''})
    dispatch({type: 'endValue', payload: ''})

  }, [start, end]);

  return (
    <Container>
      <Input
        onChange={(e) => dispatch({ type: inputType, payload: e.target.value })}
        value={start ? startingValue : state[`${inputType}`]}
      />
      {state.startValue.length > 2 && !start && (
        <AutocompleteList setStart={setStart} />
      )}
    </Container>
  );
};

export default DestinationInput;

const Container = tw.div`
      flex
      flex-col
      w-72
  `;

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
      flex
      w-2/3
      mr-8`;
