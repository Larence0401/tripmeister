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
  //const [selectedStyle, setSelectedStyle] = useState("")
  const selectedStyle = state?.selectedStopData?.[5]?.['index'] === index && state.editView ? "italic font-semibold bg-[rgb(247,247,247)]" : ""


  const handleClick = action => {
    console.log(item)
    const type = action === "delete" ? "setDeleteView" : 'setEditView'
    dispatch({type, payload: true})
    dispatch({type: 'selectStop', payload: [...item, {"index" : index}]})
    dispatch({type: 'startValue', payload: ""})
    dispatch({type: 'endValue', payload: ""})
  }

  // useEffect(() =>{
  //   console.log("selected")
  //   console.log(state?.selectedStopData)
  //     const style = state?.selectedStopData['index'] === index ? "italic font-bold" : ""
  //     setSelectedStyle(style)
  // },[state.selectedStopData])

  return (
    <Wrapper className={selectedStyle}>
      <Date className={selectedStyle}>{formattedTime}</Date>
      <Route className={selectedStyle}>{`${startingpoint} - ${destinationpoint}`}</Route>
      <Icons>
        <EditIcon
          fontSize="small"
          className={`text-slate-700 hover:text-slate-900 mr-1`}
          onClick={() => handleClick("edit")}
        />
        <DeleteIcon
          fontSize="small"
          className={`text-slate-700 hover:text-slate-900`}
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
