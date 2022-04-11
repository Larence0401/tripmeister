import { useState } from "react";
import tw from "tailwind-styled-components";
import MapIcon from "@mui/icons-material/Map";
import { useAppContext } from "../store/appContext";
import ItineraryItem from "./ItineraryItem";
import EditStop from "./EditStop";
import DeleteStop from "./DeleteStop";

const Itinerary = () => {
  const { state, dispatch } = useAppContext();
  const [listItem, setListItem] = useState("");

  console.log(listItem);
 console.log(state.editView)
 console.log(state.deleteView)
  console.log(state.itinerary);
  return (
    <Wrapper>
      <MapIcon
        className="absolute right-0 mr-4 text-slate-900"
        fontSize="large"
        onClick={() => dispatch({ type: "setMapView", payload: true })}
      />
      {state.editView ? (
        <EditStop listItem={listItem} />
      ) : state.deleteView ? (
        <DeleteStop listItem={listItem} />
      ) : (
        <ListContainer>
          {state.itinerary.map((item,index) => (
            <ItineraryItem item={item} index={index} setListItem={setListItem} />
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
