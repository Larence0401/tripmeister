import { useState, useEffect, useRef } from "react";
import tw from "tailwind-styled-components";
import SaveIcon from "@mui/icons-material/Save";
import CheckIcon from "@mui/icons-material/Check";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useAppContext } from "../store/appContext";
import { useRouter } from "next/router";
import { useAuth, db } from "../firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import useGetTripData from "../hooks/useGetTripData";

const SaveTrip = () => {
  const { state, dispatch } = useAppContext();
  const [trip, getTripData] = useGetTripData();
  const [tripnameInput, setTripnameInput] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const user = useAuth();
  const checkIcon =
    (tripnameInput && tripnameInput.length < 4) || errorMsg !== "" ? (
      ""
    ) : (
      <CheckIcon
        className="text-green-500 font-bold hover:text-gree-700 cursor-pointer"
        onClick={async () => await handleClickOnTripName()}
      />
    );

  const textFieldRef = useRef();

  const handleKeyDown = async (e) => {
    e.key === "Enter" && tripnameInput && tripnameInput.length > 3
      ? await saveTrip()
      : null;
  };

  const handleClickOnTripName = async () => {
    tripnameInput && tripnameInput.length > 3 ? await saveTrip() : null;
    dispatch({ type: "setTripnameInput", payload: false });
    dispatch({ type: "requestUpload", payload: false });
  };

  const addItinerary = async () => {
    const colRef = collection(db, "users", user?.uid, "itineraries");
    await addDoc(colRef, {
      tripname: tripnameInput,
      data: JSON.stringify(state.itinerary),
    });
  };

  const checkIfTripNameIsTaken = () => {
    if (!tripnameInput || !trip) return;
    trip.some((el) => el.tripName === tripnameInput)
      ? setErrorMsg("trip name is already taken!")
      : setErrorMsg("");
  };

  const handleClickonSaveBtn = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    !state.tripName
      ? dispatch({ type: "setTripnameInput", payload: true })
      : showSuccessMsg();
    state.tripName && !state.tripID
      ? await queryTripID()
      : state.tripName && state.tripID
      ? await updateItinerary()
      : () => setTripnameInput("y");
  };

  const saveTrip = async () => {
    dispatch({ type: "setTripName", payload: tripnameInput });
    if (state.editView) dispatch({ type: "setTripnameInput", payload: false });
    await addItinerary();
    setTripnameInput(null);
    showSuccessMsg();
  };

  const queryTripID = async () => {
    const colRef = collection(db, "users", user?.uid, "itineraries");
    const q = query(colRef, where("tripname", "==", state.tripName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dispatch({ type: "setTripID", payload: doc.id });
    });
  };

  const updateItinerary = async () => {
    if (!state.tripID) return;
    const itineraryRef = doc(
      db,
      "users",
      user?.uid,
      "itineraries",
      state.tripID
    );
    await updateDoc(itineraryRef, { data: JSON.stringify(state.itinerary) });
  };

  const showSuccessMsg = () => {
    if (state.editView) {
      showSaveFeedback();
    } else {
      const msg = document.getElementById("msg");
      msg.style.display = "block";
      setTimeout(() => {
        msg.style.display = "none";
      }, 1000);
    }
  };

  const showSaveFeedback = () => {
    const checkIconEl = document.getElementById("check_icon");
    const saveIconEl = document.getElementById("save_icon");
    saveIconEl.classList.add("!hidden");
    checkIconEl.classList.remove("!hidden");
    setTimeout(() => {
      saveIconEl.classList.remove("!hidden");
      checkIconEl.classList.add("!hidden");
    }, 800);
  };

  useEffect(() => {
    (async () => await updateItinerary())();
  }, [state.tripID]);

  useEffect(() => {
    if (state.tripName) dispatch({ type: "setTripnameInput", payload: false });
  }, [state.tripName]);

  useEffect(() => {
    if (state.uploadRequested) textFieldRef.current.focus();
  }, [state.uploadRequested]);

  useEffect(() => {
    (async () => await getTripData())();
  }, [user]);

  useEffect(() => {
    if (!trip) return;
    checkIfTripNameIsTaken();
  }, [tripnameInput]);

  return (
    <>
      {state.editView ? (
        <>
          {(!state.tripnameInput && !state.uploadRequested) ||
          state.tripName ? (
            <IconContainer
              className="icon_container bg-green-600"
              onClick={() => handleClickonSaveBtn()}
            >
              <SaveIcon id="save_icon" className="text-white" />
              <CheckIcon id="check_icon" className="text-white !hidden" />
            </IconContainer>
          ) : (
            <TextField
              className="p-2 w-full bg-white shadow-md rounded-lg"
              inputRef={textFieldRef}
              size="small"
              placeholder="Please choose a name for your trip"
              onKeyUp={(e) => setTripnameInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{checkIcon}</InputAdornment>
                ),
              }}
            />
          )}
        </>
      ) : (
        <>
          {!state.tripnameInput || state.tripName ? (
            <div className="flex items-center">
              <SaveButton onClick={async () => await handleClickonSaveBtn()}>
                Save trip
                <SaveIcon className="ml-2 self-center pb-1" />
              </SaveButton>
              <SuccessMsg id="msg">trip saved!</SuccessMsg>
            </div>
          ) : (
            <TextField
              className="p-2 w-full"
              size="small"
              placeholder="Please choose a name for your trip"
              onKeyUp={(e) => setTripnameInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{checkIcon}</InputAdornment>
                ),
              }}
            />
          )}
        </>
      )}
      <p className="self-start pl-2 italic text-red-500">{errorMsg}</p>
    </>
  );
};

export default SaveTrip;

const IconContainer = tw.div`
    flex
    justify-center
    items-center
    p-2
    rounded-full
    bg-white
    box-border
    cursor-pointer
    bg-green-600
    hover:bg-green-700
    `;

const SaveButton = tw.div`
    absolute
    rounded-md
    bg-green-600
    hover:bg-green-700
    border
    border-green-900
    text-green-100
    shadow-lg
    text-center
    box-border
    leading-8
    md:leading-10
    left-0
    ml-4
    md:ml-8
    mt-6
    md:mt-0
    px-3
    text-lg
    uppercase
    align-center
    w-auto
    cursor-pointer`;

const SuccessMsg = tw.div`
    ml-8
    text-slate-800
    uppercase
    hidden
`;
