import { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import HotelIcon from "@mui/icons-material/Hotel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from '@mui/icons-material/Close';
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import ActivityList from "./ActivityList"

const EditNotes = () => {
  const [accommodation, setAccommodation] = useState("");
  const [accIsSet, setAccIsSet] = useState(false);
  const [activityInput, setActivityInput] = useState(false);
  const [activity, setActivity] = useState("");
  const [listItem, setListItem] = useState("");
  const { state, dispatch } = useAppContext();

  const checkIcon_acc =
    accommodation === "" ? (
      ""
    ) : (
      <CheckIcon onClick={() => submitAccommodation()} />
    );

  const checkIcon_act =
    activity === "" ? "" : <CheckIcon onClick={() => submitActivity(activity)} />;

  const submitActivity = (activity) => {
    setActivityInput(false);
    const arr = [...state.itinerary];
    const index = state.selectedStopData[5]["index"];
    arr[index][4]["activities"].push(activity);
    dispatch({ type: "updateItinerary", payload: arr });
  };

  const submitAccommodation = () => {
    setAccIsSet(true);
    const arr = [...state.itinerary];
    const index = state.selectedStopData[5]["index"];
    arr[index][3]["accommodation"] = accommodation;
    dispatch({ type: "updateItinerary", payload: arr });
  };

  console.log(state.itinerary);

  return (
    <Wrapper>
      {!accIsSet ? (
        <TextField
          placeholder="add accommodation"
          size="small"
          onKeyUp={(e) => setAccommodation(e.target.value)}
          className="uppercase w-full"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <HotelIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">{checkIcon_acc}</InputAdornment>
            ),
          }}
        />
      ) : (
        <Accommodation>
          <HotelIcon className="mr-8" />
          {accommodation}
          <EditIcon
            className="justify-self-end ml-4 text-slate-700 hover:text-slate-900"
            fontSize="small"
            onClick={() => setAccIsSet(false)}
          />
        </Accommodation>
      )}
      <ActivityContainer>
        <ActivityList/>
        {!activityInput && (
          <AddActivity>
            add activity{" "}
            <AddCircleIcon
              className="ml-2"
              onClick={() => setActivityInput(true)}
            />
          </AddActivity>
        )}
        {activityInput && (
          <TextField
          className="p-2"
          size="small"
            placeholder="add activity"
            onKeyUp={(e) => setActivity(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalActivityIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">{checkIcon_act}</InputAdornment>
              ),
            }}
          />
        )}
      </ActivityContainer>
    </Wrapper>
  );
};

export default EditNotes;

const Wrapper = tw.div`
    rounded-lg
    shadow-md
    box-border
    flex
    flex-col
    items-start
    bg-white
    m-8
    mb-4
    p-8
    h-auto
    w-full`;

const Accommodation = tw.div`
    flex
    justify-start
    items-center
    uppercase
    px-2
    w-full`;

const AddActivity = tw.div`
    leading-10
    rounded-lg
    bg-slate-600
    text-slate-100
    font-semibold
    text-lg
    uppercase
    px-4
    py-1
    flex
    items-center
    justify-center
    mt-4
    text-center
`;

const ActivityContainer = tw.div`
  mt-8
  pt-4
  border-t
  border-slate-300
  w-full
`;
