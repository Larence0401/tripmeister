import { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import { format } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAppContext } from "../store/appContext";

const ItineraryItem = ({ item, index}) => {
  const { state, dispatch } = useAppContext()
  const startingpoint = item[0].place.split(",")[0];
  const destinationpoint = item[1].place.split(",")[0];
  const formattedTime = format(item[2], "dd MMM");
  const leftCol = state?.itinerary?.[index]?.[5]?.['stayOvernight'] ? formattedTime : "(stopover)"
  console.log(state.editViewType)
  //console.log(state.tripnameInput)
  

  const selectedStyle = state?.selectedStopData?.[6]?.['index'] === index && state.editView ? "italic font-semibold" : ""


  const handleClick = action => {
    const type = action === "delete" ? "setDeleteView" : 'setEditView'
    dispatch({type, payload: true})
    dispatch({type: 'selectStop', payload: [...item, {"index" : index}]})
    dispatch({type: 'startValue', payload: ""})
    dispatch({type: 'endValue', payload: ""})
  }



  return (
    <Wrapper className={selectedStyle}>
      <Date className={selectedStyle}>{leftCol}</Date>
      <Route className={`${selectedStyle} truncate`}>{`${startingpoint} - ${destinationpoint}`}</Route>
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
    </Wrapper>
  );
};

export default ItineraryItem;

const Wrapper = tw.div`
    bg-white
    border-b
    border-slate-300
    py-4
    px-2
    flex
    w-full
`;

const Route = tw.div`
flex-1
`;
const Date = tw.div`
w-1/3
`;

const Icons = tw.div`
`;
