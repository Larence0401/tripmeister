import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import { useState, useEffect } from "react";

const AutocompleteList = ({ setStart, setEnd }) => {
  const { state } = useAppContext();
  const [val, setVal] = useState(null);
  const suggestions = setStart ? "startSuggestion" : "endSuggestion";
  const marginLeft = state.selectedStopData ? "" : "mx-8"
  console.log(suggestions);
  console.log(state.startSuggestion)
  console.log(state.endSuggestion)

  useEffect(() => {
    setStart ? setStart(val) : setEnd(val);
  }, [val]);

  return (
    <Wrapper className={marginLeft}>
      <ul>
      {state[`${suggestions}`].map((el, index) => (
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
