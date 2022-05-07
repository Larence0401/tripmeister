import { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import CheckIcon from "@mui/icons-material/Check";
import getStartingLocation from "../utils/getStartingLocation";
import getEndLocation from "../utils/getEndLocation";

const ActivityList = ({activities}) => {
console.log(activities)

  const { state, dispatch } = useAppContext();
  const [isSelected, setIsSelected] = useState(null);
  const [toBeDeleted, setToBeDeleted] = useState(false);
  const [value, setValue] = useState(null);
  const index = state.selectedStopData[5]["index"];
  const arr = [...state.itinerary]
  const subIndex = isSelected
  const checkIcon_act =
  value === "" ? "" : <CheckIcon onClick={() => updateActivity()} />;
  const listItemStyle = toBeDeleted ? "line-through text-slate-700" : ""


  const updateActivity = () => {
    setIsSelected(null)
    arr[index][4]["activities"].splice(subIndex,1,value)
    dispatch({ type: "updateItinerary", payload: arr });
  };

  const deleteActivity = () => {
    arr[index][4]["activities"].splice(subIndex,1)
    dispatch({ type: "updateItinerary", payload: arr });
  }

  const handleClick = (i) => {
    setIsSelected(i)
    setToBeDeleted(true)
  }

  useEffect(() => {
    if(!toBeDeleted) return
    deleteActivity()
    setToBeDeleted(false)
    setIsSelected(null)
  },[isSelected, toBeDeleted, state.itinerary])


  const listItems =
    activities.length > 0
      ? activities.map((el, i) =>
          isSelected !== i ? (
            <ListItem className={listItemStyle}>
              <Activity>{`- ${el.activity}`}</Activity>
              <Time>{el.timeVal}</Time>
              
              <div>
                <EditIcon
                  fontSize="small"
                  className="text-slate-700"
                  onClick={() => setIsSelected(i)}
                />
                <DeleteIcon fontSize="small" className="text-slate-700 ml-2" onClick={() => handleClick(i)}/>
              </div>
            </ListItem>
          ) : (
            <TextFieldContainer>
              <TextField
                size="small"
                placeholder="edit activity"
                onKeyUp={(e) => setValue(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">{checkIcon_act}</InputAdornment>
                  ),
                }}
              />
            </TextFieldContainer>
          )
        )
      : "";
  return <List>{listItems}</List>;
};

export default ActivityList;

const List = tw.ul`
   list-disc
   w-full
 `;

const ListItem = tw.li`
   p-2
   flex
   w-full
   justify-between
   border-b
   border-slate-300
   border-dashed
 `;

const TextFieldContainer = tw.div`

 mx-4
 mr-8
 my-2

 `;

const Time = tw.div`
w-2/12
 `;

 const Activity = tw.div`
w-6/12
truncate
 `;
