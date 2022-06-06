import { useState } from "react";
import tw from "tailwind-styled-components";
import MapIcon from "@mui/icons-material/Map";
import { useAppContext } from "../store/appContext";
import ItineraryItem from "./ItineraryItem";
import DeleteStop from "./DeleteStop";
import AddIcon from "@mui/icons-material/Add";
import dynamic from "next/dynamic";

const SaveTrip = dynamic(() => import("./SaveTrip"), {
  loading: () => "Loading...",
  ssr: false,
});

const Itinerary = () => {
  const { state, dispatch } = useAppContext();
  const [listItem, setListItem] = useState("");
  const slideIn = state.sidebarIsOpen
    ? "translate-x-[250px] duration-300 ease-in-out"
    : "-translate-x-0 duration-300 ease-in-out";

  const marginTop = state.readingMode ? "" : "mt-12";

  const handleClick = () => {
    dispatch({ type: "setEditView", payload: false });
    dispatch({ type: "setEditViewType", payload: "directions" });
    dispatch({ type: "selectStop", payload: [] });
  };

  return (
    <Wrapper className={slideIn}>
      {state.editView && !state.deleteView && !state.readingMode && (
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
      {state.itinerary.length > 0 &&
        !state.editView &&
        !state.readingMode &&
        !state.deleteView && <SaveTrip />}
      {state.deleteView ? (
        <DeleteStop listItem={listItem} />
      ) : (
        <ListContainer className={marginTop}>
          {state.itinerary.map((item, index) => (
            <ItineraryItem
              key={index}
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
    p-4
    md:p-8
    mt-0
    md:mt-4
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
    w-full
    pt-0
    md:pt-8
    lg:pt-0
`;

const AddStop = tw.div`
    uppercase
    py-1
    px-3
    text-slate-900
    hover:bg-[rgb(247,247,247)]
    border
    rounded-sm
    border-slate-900
    rounded
    ml-8
    absolute
    flex
    items-center
    cursor-pointer
    left-0`;
