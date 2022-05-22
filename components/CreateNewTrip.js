import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import AddIcon from "@mui/icons-material/Add";

// This component resets the global state so that the user can create a new itinerary from scratch

const CreateNewTrip = () => {
  const { dispatch } = useAppContext();

  const resetState = () => {
    dispatch({ type: "updateItinerary", payload: [] });
    dispatch({ type: "setReadingMode", payload: false });
    dispatch({ type: "setEditView", payload: false });
    dispatch({ type: "updateRouteData", payload: [] });
    dispatch({ type: "setEditViewType", payload: "directions" });
  };

  return (
    <Container onClick={() => resetState()}>
      create new trip
      <AddIcon className="ml-2" />
    </Container>
  );
};

export default CreateNewTrip;

const Container = tw.div`
text-white
uppercase
border-b
border-slate-400
py-4
flex
items-center
w-full
hover:bg-slate-700
cursor-pointer
`;
