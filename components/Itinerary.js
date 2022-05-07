import { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import MapIcon from "@mui/icons-material/Map";
import { useAppContext } from "../store/appContext";
import ItineraryItem from "./ItineraryItem";
import DeleteStop from "./DeleteStop";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import Link from "next/link";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import { useAuth, db } from "../firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  setDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const Itinerary = () => {
  const { state, dispatch } = useAppContext();
  const [listItem, setListItem] = useState("");
  const [tripnameInput, setTripnameInput] = useState(null);
  const [tripID, setTripID] = useState(null);
  const router = useRouter();
  const user = useAuth();

  const slideIn = state.sidebarIsOpen
    ? "translate-x-[250px] duration-300 ease-in-out"
    : "-translate-x-0 duration-300 ease-in-out";

  const checkIcon =
    tripnameInput && tripnameInput.length < 4 ? (
      ""
    ) : (
      <CheckIcon
        className="text-green-500 font-bold hover:text-gree-700 cursor-pointer"
        onClick={async () => await handleClickOnTripName()}
      />
    );

  const handleClick = () => {
    dispatch({ type: "setEditView", payload: false });
    dispatch({ type: "setEditViewType", payload: "directions" });
  };

  const handleKeyDown = async (e) => {
    e.key === "Enter" && tripnameInput && tripnameInput.length > 3
      ? await saveTrip()
      : null;
  };

  const handleClickOnTripName = async () =>
    tripnameInput && tripnameInput.length > 3 ? await saveTrip() : null;

  const addItinerary = async () => {
    const colRef = collection(db, "users", user?.uid, "itineraries");
    await addDoc(colRef, {
      tripname: tripnameInput,
      data: JSON.stringify(state.itinerary),
    });
  };

  const saveTrip = async () => {
    dispatch({ type: "setTripName", payload: tripnameInput });
    if (user) {
      await addItinerary();
    } else {
      router.push("/login");
    }
    setTripnameInput(null);
  };

  const queryTripID = async () => {
    const colRef = collection(db, "users", user?.uid, "itineraries");
    const q = query(colRef, where("tripname", "==", state.tripName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setTripID(doc.id);
    });
  };

  const updateItinerary = async () => {
    if(!tripID) return
    const itineraryRef = doc(db, "users", user?.uid, "itineraries", tripID)
    await updateDoc(itineraryRef, {data: JSON.stringify(state.itinerary)})
  }

  useEffect(() => {
    (async () => await updateItinerary())()
  },[tripID])
  console.log(tripID);

  return (
    <Wrapper className={slideIn}>
      {state.editView && !state.deleteView && (
        <AddStop onClick={() => handleClick()}>
          add new stop
          <AddIcon className="ml-2" />
        </AddStop>
      )}
      <div className="lg:hidden">
        <MapIcon
          className="absolute right-0 mr-8 text-slate-900"
          fontSize="large"
          onClick={() => dispatch({ type: "setMapView", payload: true })}
        />
      </div>
      {state.itinerary.length > 0 && !state.editView && (
        <>
          {!tripnameInput || state.tripName ? (
            <SaveButton
              onClick={
                state.tripName
                  ? async () => await queryTripID()
                  : () => setTripnameInput("y")
              }
            >
              Save trip
              <SaveIcon className="ml-2 self-center pb-1" />
            </SaveButton>
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
        //   </a>
        // </Link>
      )}
      {state.deleteView ? (
        <DeleteStop listItem={listItem} />
      ) : (
        <ListContainer>
          {state.itinerary.map((item, index) => (
            <ItineraryItem
              item={item}
              index={index}
              setListItem={setListItem}
            />
          ))}
        </ListContainer>
      )}
    </Wrapper>
  );
};

export default Itinerary;

const Wrapper = tw.div`
    bg-white
    relative
    p-8
    mt-4
    flex
    flex-col
    items-center
    w-full
    h-full
    max-h-[450px]
    lg:rounded-lg
    shadow-md
    overflow-auto
    `;

const ListContainer = tw.div`
    mt-4
    w-full
    mt-12`;

const AddStop = tw.div`
    uppercase
    py-1
    px-3
    text-slate-900
    border
    rounded-sm
    border-slate-900
    rounded
    ml-8
    absolute
    flex
    items-center
    left-0`;

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
    leading-10
    left-0
    ml-8
    px-3
    text-lg
    uppercase
    align-center
    w-auto
    cursor-pointer`;
