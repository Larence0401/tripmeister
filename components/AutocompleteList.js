import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import { useState, useEffect } from "react";

// This component renders a list of autocomplete suggestions for locations based on the characters the user types into the input field.
// The suggestions are provided by the Mapbox GL API and stored in the global state.

const AutocompleteList = ({ setStart, setEnd }) => {
  const { state } = useAppContext();
  const [val, setVal] = useState(null);
  const suggestions = setStart ? "startSuggestion" : "endSuggestion";
  const marginLeft = state.selectedStopData ? "" : "mx-8";

  useEffect(() => {
    setStart ? setStart(val) : setEnd(val);
  }, [val]);

  return (
    <Wrapper className={marginLeft}>
      <ul>
        {state[`${suggestions}`].length > 0 &&
          state[`${suggestions}`].map((el, index) => (
            <ListItem
              onClick={() =>
                setVal({
                  place: el.place_name,
                  index: index,
                  coordinates: el.center,
                })
              }
              key={index}
            >
              {el.place_name}
            </ListItem>
          ))}
      </ul>
    </Wrapper>
  );
};

export default AutocompleteList;

const Wrapper = tw.div`
px-2
py-1
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
