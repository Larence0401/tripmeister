import { useState } from "react";
import tw from "tailwind-styled-components";
import MapIcon from "@mui/icons-material/Map";
import { useAppContext } from "../store/appContext";
import ItineraryItem from "./ItineraryItem";
import EditStop from "./EditStop";
import DeleteStop from "./DeleteStop";
import AddIcon from "@mui/icons-material/Add";

const Itinerary = () => {
  const { state, dispatch } = useAppContext();
  const [listItem, setListItem] = useState("");

  return (
    <Wrapper>
      {state.editView && (
        <AddStop onClick={()=> dispatch({type: 'setEditView', payload: false})}>
          add new stop
          <AddIcon className="ml-2" />
        </AddStop>
      )}
      <MapIcon
        className="absolute right-0 mr-4 text-slate-900"
        fontSize="large"
        onClick={() => dispatch({ type: "setMapView", payload: true })}
      />
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
    pt-4
    flex
    flex-col
    items-center
    w-full
    h-full`;

const ListContainer = tw.div`
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
    left-0`;
