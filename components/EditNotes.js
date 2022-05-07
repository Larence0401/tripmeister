import { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckIcon from "@mui/icons-material/Check";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import ActivityList from "./ActivityList";
import Activities from "./Activities"
import getStartingLocation from "../utils/getStartingLocation";
import getEndLocation from "../utils/getEndLocation";
import TimeField from "react-simple-timefield";

const EditNotes = () => {
  const [activityInput, setActivityInput] = useState(false);
  const [activity, setActivity] = useState("");
  const [showLocationSelect, setShowLocationSelect] = useState(false);
  const [timeSelect, setTimeSelect] = useState(null);
  const [showTimeField, setShowTimeField] = useState(false);
  const [time, setTime] = useState("12:00");
  const [location, setLocation] = useState("");
  const { state, dispatch } = useAppContext();
  const start = getStartingLocation(state.selectedStopData);
  const end = getEndLocation(state.selectedStopData);
  const checkIcon_act =
    activity === "" ? (
      ""
    ) : (
      // <CheckIcon onClick={() => submitActivity(activity)} />
      <CheckIcon onClick={() => setShowLocationSelect(true)} />
    );

  const submitActivity = () => {
    setTimeSelect(false)
    setActivityInput(false);
    const arr = [...state.itinerary];
    const index = state.selectedStopData[6]["index"];
    const timeVal = showTimeField ? time : null;
    const activityObject = { activity, location, timeVal };
    arr[index][4]["activities"].push(activityObject);
    dispatch({ type: "updateItinerary", payload: arr });
  };

  const handleClick = (location) => {
    setLocation(location);
    setShowLocationSelect(false);
    setTimeSelect(true);
    setShowTimeField(false)
  };



  console.log(state.itinerary);

  return (
    <Wrapper>
      <ActivityContainer>
        {/* <ActivityList /> */}
        <Activities/>
        {!activityInput && (
          <AddActivity>
            add activity{" "}
            <AddCircleIcon
              className="ml-2"
              onClick={() => setActivityInput(true)}
            />
          </AddActivity>
        )}
        {activityInput && !showLocationSelect && !timeSelect && (
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
        {showLocationSelect && (
          <>
            <p className="pl-2">assign activity to ...</p>
            <LocationSelect>
              <Button onClick={() => handleClick(start)}>{start}</Button>
              <span>OR</span>
              <Button onClick={() => handleClick(end)}>{end}</Button>
            </LocationSelect>
          </>
        )}
        {timeSelect && (
          <div className="flex flex-col">
            <TimeContainer>
              <p className="mr-4 text-lg">assign time to activity?</p>
              <input
                type="checkbox"
                className="mr-4 scale-150"
                onChange={() => setShowTimeField(prev => !prev)}
              />
              {showTimeField && (
                <TimeField
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              )}
            </TimeContainer>
            <AddActivity onClick={() => submitActivity()}>
              Add to list
              <AddCircleIcon className="ml-2" />
            </AddActivity>
          </div>
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
    mx-0
    mb-4
    p-8
    h-auto
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
    text-center
`;

const ActivityContainer = tw.div`
    w-full
`;

const LocationSelect = tw.div`
w-full
flex
items-center
`;
const Button = tw.div`
w-1/2
m-2
p-2
py-1
border
border-slate-600
rounded-md
text-center
uppercase
`;

const TimeContainer = tw.div`
w-full
flex
items-center
p-2
mb-2
`;
