import { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import HotelSuggestions from "./HotelSuggestions";
import HotelSearch from "./HotelSearch";

// this component lets the user edit and delete a selected accommodation. The hotel component also renders 2 child components for rendering suggested accommodations and for
//searching by name and

const Hotel = () => {
  const [isSearch, setIsSearch] = useState(false);
  const [hotelSelected, setHotelSelected] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { state, dispatch } = useAppContext();
  const index = state?.selectedStopData?.[6]?.["index"];
  const hotelName = state?.itinerary?.[index]?.[3]?.["text"];
  const address = state?.itinerary?.[index]?.[3]?.["properties"]?.["address"];
  const slideIn = state.sidebarIsOpen
    ? "translate-x-[250px] duration-300 ease-in-out"
    : "-translate-x-0 duration-300 ease-in-out";

  const deleteHotel = () => {
    const arr = state?.itinerary;
    arr?.[index].splice(3, 1, { accommodation: "no accommodation selected" });
    dispatch({ type: "updateItinerary", payload: arr });
  };

  return (
    <Wrapper className={slideIn}>
      {(hotelSelected || (hotelName && !hotelSelected)) &&
        (!isEditMode || !state.editMode) && (
          <HotelData>
            <div className="flex flex-col">
              <HotelName>{hotelName}</HotelName>
              <Address>
                <LocationOnIcon className="mr-2" />
                {address}
              </Address>
            </div>
            <Icons>
              <EditIcon
                className="mr-2 cursor-pointer text-slate-700 hover:text-slate-900"
                onClick={() => setIsEditMode(true)}
              />
              <DeleteIcon
                className="cursor-pointer text-slate-700 hover:text-slate-900"
                onClick={() => deleteHotel()}
              />
            </Icons>
          </HotelData>
        )}

      {((!hotelSelected && !hotelName) || isEditMode) && (
        <SearchSelect>
          <Suggestions onClick={() => setIsSearch(false)}>
            {isSearch ? (
              <RadioButtonUncheckedIcon className="mr-2" />
            ) : (
              <RadioButtonCheckedIcon className="mr-2" />
            )}
            Suggestions
          </Suggestions>
          <Search onClick={() => setIsSearch(true)}>
            {isSearch ? (
              <RadioButtonCheckedIcon className="mr-2" />
            ) : (
              <RadioButtonUncheckedIcon className="mr-2" />
            )}
            Search <SearchIcon />
          </Search>
        </SearchSelect>
      )}

      {((!hotelSelected && !isSearch && !hotelName) ||
        (isEditMode && !isSearch)) && (
        <HotelSuggestions
          setHotelSelected={setHotelSelected}
          setIsEditMode={setIsEditMode}
        />
      )}
      {((!hotelSelected && isSearch && !hotelName) ||
        (isEditMode && isSearch)) && <HotelSearch />}
    </Wrapper>
  );
};

export default Hotel;

const Wrapper = tw.div`
    rounded-lg
    shadow-md
    box-border
    flex
    flex-col
    items-start
    bg-white
    overflow-y-scroll
    m-8
    mx-0
    mb-4
    p-8
    h-auto
    w-full`;

const SearchSelect = tw.div`
flex
justify-between
w-full
uppercase
items-center
mb-4
`;

const Suggestions = tw.div`
pb-0
md:pb-2
`;

const Search = tw.div`
pb-0
md:pb-2
`;

const Header = tw.div`
font-semibold
flex
`;

const HotelData = tw.div`
font-semibold
flex
w-full
justify-between
`;

const HotelName = tw.div`
flex
`;

const Icons = tw.div`

`;

const Address = tw.div`
flex
font-light
mt-4
`;
