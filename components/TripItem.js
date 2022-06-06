import { useEffect, useState } from "react";
import { useAppContext } from "../store/appContext";
import { db } from "../firebase";
import { deleteDoc, getDoc, doc } from "firebase/firestore";
import tw from "tailwind-styled-components";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

const TripItem = ({ trip, user }) => {
  const { dispatch, state } = useAppContext();
  const docRef = doc(db, "users", user.uid, "itineraries", trip.id);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [hidden, setHidden] = useState(false);
  const bgColor = deleteConfirm ? "bg-slate-700" : "bg-slate-600";
  const isHidden = hidden ? "hidden" : "";

  const initViewMode = async () => {
    loadItinerary();
    dispatch({ type: "setReadingMode", payload: true });
    dispatch({ type: "setEditViewType", payload: "hotel" });
  };

  const initEditMode = async () => {
    loadItinerary();
    dispatch({ type: "setEditView", payload: true });
    dispatch({ type: "setReadingMode", payload: false });
    dispatch({ type: "setEditViewType", payload: "directions" });
  };

  const loadItinerary = async () => {
    const docSnap = await getDoc(docRef);
    const itineraryString = docSnap.data().data;
    const tripname = docSnap.data().tripname;
    let itineraryObject = JSON.parse(itineraryString);
    itineraryObject =
      typeof itineraryObject === "string"
        ? JSON.parse(itineraryObject)
        : itineraryObject;
    const itinerary = recreateDateObjects(itineraryObject);
    dispatch({ type: "updateItinerary", payload: itinerary });
    dispatch({ type: "setTripName", payload: tripname });
  };

  const preselectFirstStage = () =>
    dispatch({
      type: "selectStop",
      payload: [...state.itinerary[0], { index: 0 }],
    });

  const recreateDateObjects = (arr) => {
    arr.map((el) => {
      const dateString = el[2];
      const date = new Date(dateString);
      el.splice(2, 1, date);
    });
    return arr;
  };

  const deleteTrip = async () => {
    await deleteDoc(docRef);
    setDeleteConfirm(false);
    setHidden(true);
  };

  useEffect(() => {
    state.itinerary.length > 0 ? preselectFirstStage() : null;
    recalculateRoute();
  }, [state.itinerary]);

  return (
    <Container className={`${bgColor} ${isHidden}`}>
      {!deleteConfirm && (
        <>
          <TripName>{trip.tripName}</TripName>
          <IconContainer>
            <VisibilityIcon
              fontSize="small"
              className="cursor-pointer text-green-500 opacity-80 hover:opacity-100"
              onClick={async () => await initViewMode()}
            />
            <EditIcon
              fontSize="small"
              className="cursor-pointer text-yellow-500 opacity-80 hover:opacity-100"
              onClick={async () => await initEditMode()}
            />
            <DeleteIcon
              fontSize="small"
              className="cursor-pointer text-red-500 opacity-80 hover:opacity-100"
              onClick={() => setDeleteConfirm(true)}
            />
          </IconContainer>
        </>
      )}
      {deleteConfirm && (
        <DeleteConfirm>
          <span>{`Delete ${trip.tripName}?`}</span>
          <CheckIcon
            onClick={async () => await deleteTrip()}
            className="cursor-pointer text-green-500 opacity-80 hover:opacity-100 ml-4"
          />
          <CancelIcon
            onClick={() => setDeleteConfirm(false)}
            className="cursor-pointer text-red-500 opacity-80 hover:opacity-100 ml-4"
          />
        </DeleteConfirm>
      )}
    </Container>
  );
};

export default TripItem;

const Container = tw.div`
text-white
hover:bg-slate-700
py-2
border-b
border-dotted
border-slate-200
flex
w-full
    `;

const TripName = tw.div`
    w-8/12
    pl-4
    italic
        `;

const IconContainer = tw.div`
  w-4/12
  flex
  items-center
  justify-between
        `;

const DeleteConfirm = tw.div`
uppercase
pl-4
        `;
