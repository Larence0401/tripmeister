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

const Hotel = () => {
  const [isSearch, setIsSearch] = useState(false);
  const [hotelSelected, setHotelSelected] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { state } = useAppContext();
  const index = state?.selectedStopData?.[6]?.["index"];
  const hotelName = state?.itinerary?.[index]?.[3]?.["text"];
  const address = state?.itinerary?.[index]?.[3]?.["properties"]?.["address"];

  const deleteHotel = () => state.itinerary?.[index].splice(3,1,"no hotel selected")


  return (
    <Wrapper>
      {(hotelSelected || (hotelName && !hotelSelected)) && !isEditMode && (
        <HotelData>
          <div className="flex flex-col">
            <HotelName>{hotelName}</HotelName>
            <Address>
              <LocationOnIcon className="mr-2" />
              {address}
            </Address>
          </div>
          <Icons>
            <EditIcon className="mr-2" onClick={() => setIsEditMode(true)} />
            <DeleteIcon onClick={() => deleteHotel()}/>
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

      {((!hotelSelected && !isSearch && !hotelName) || isEditMode) && (
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
pb-2
`;

const Search = tw.div`
pb-2
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
