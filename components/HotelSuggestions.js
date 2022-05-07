import { useState, useEffect } from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import getHotels from "../utils/getHotels";
import getRideDetails from "../utils/getRideDetails";
import getEndLocation from "../utils/getEndLocation";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Icon from "@mui/material/Icon";
import HotelDetails from "./HotelDetails";
import useUpdateHotel from "../hooks/useUpdateHotel";

const HotelSuggestions = ({ setHotelSelected, setIsEditMode }) => {
  const { state, dispatch } = useAppContext();

  const [accommodationType, setAccommodationType] = useState("hotel");
  const [hotelData, setHotelData] = useState([]);
  const [index, setSelectedIndex] = useState(null);
  const [distance, setDistance] = useState([]);
  const [detailsShown, setDetailsShown] = useState(null);
  const [selected, setSelected] = useState(null);
  const coords = state?.selectedStopData?.[1]?.["coordinates"];
  const uneven = "bg-[rgb(247,247,247)]";
  const location = getEndLocation(state.selectedStopData);
  const active = "bg-slate-600 text-slate-100";

  const updateHotel = useUpdateHotel(hotelData?.[index]);
  const getHotelName = (hotel) => {
    return hotel?.place_name.split(",")[0];
  };

  const formatDistance = (dist) => {
    const output =
      dist < 1000
        ? Math.floor(dist) + " m"
        : Math.floor(dist / 1000) + "." + (dist % 1000).toString()[0] + " km";
    return output;
  };

  const getDistanceToCityCenter = async (hotel) => {
    if (hotelData.length === 0) return;
    const result = hotelData.map(async (el) => {
      const end = el.center;
      const data = await getRideDetails(coords, end);
      const dist = data.distance;
      const output = formatDistance(dist);
      return output;
    });
    const array = await Promise.all(result);
    setDistance(array);
  };

  const handleSubmit = () => {
    setHotelSelected(true);
    setIsEditMode(false);
    const arr = [...state.itinerary];
    const hotel = hotelData[selected];
    const index = state.selectedStopData[6]["index"];
    arr[index].splice(3, 1, hotel);
    dispatch({ type: "updateItinerary", payload: arr });
  };

  useEffect(() => {
    if (!index || hotelData.length === 0) return;
    updateHotel();
  }, [index]);

  useEffect(() => {
    if (hotelData.length === 0) return;
    getDistanceToCityCenter(hotelData);
  }, [hotelData]);

  useEffect(() => {
    (async () => {
      const hotelData = await getHotels(accommodationType, coords);
      setHotelData(hotelData);
    })();
  }, [accommodationType, state.selectedStopData]);

  return (
    <>
      <FormControl fullWidth>
        <Select
          size="small"
          value={accommodationType}
          onChange={(e) => setAccommodationType(e.target.value)}
        >
          <MenuItem value="hotel">FIND HOTELS</MenuItem>
          <MenuItem value="hostel">FIND HOSTELS</MenuItem>
        </Select>
      </FormControl>
      <ListContainer>
        {hotelData.length > 0 && (
          <Header>
            <HeaderCol1>{`${accommodationType}s in ${location}`}</HeaderCol1>
            <HeaderCol2>distance to town center</HeaderCol2>
          </Header>
        )}

        {hotelData.length < 1 && (
          <p className="italic text-red-500">{`No ${accommodationType}s in ${location}!`}</p>
        )}
        {hotelData.map((el, i) => (
          <>
            <Row
              className={selected === i ? active : i % 2 === 0 ? uneven : null}
              onClick={() => setSelected((prev) => (i === prev ? null : i))}
            >
              <ListCol1>{hotelData.length > 0 && getHotelName(el)}</ListCol1>
              <ListCol2>{distance[i]}</ListCol2>
              <ListCol3>
                <Icon className="text-right">
                  {detailsShown === i ? (
                    <ArrowDropUpIcon
                      onClick={() => setDetailsShown(null)}
                      fontSize="medium"
                    />
                  ) : (
                    <ArrowDropDownIcon
                      onClick={() => setDetailsShown(i)}
                      fontSize="medium"
                    />
                  )}
                </Icon>
              </ListCol3>
            </Row>
            {detailsShown === i && (
              <HotelDetails
                address={el.properties.address}
                district={el.context[1]["text"]}
              />
            )}
          </>
        ))}
        {selected && (
          <Button
            onClick={() => handleSubmit()}
          >{`select ${accommodationType}`}</Button>
        )}
      </ListContainer>
    </>
  );
};

export default HotelSuggestions;

const ListContainer = tw.div`
mt-4
w-full
`;

const Header = tw.div`
mt-4
p-2
flex
w-full
font-semibold
`;

const HeaderCol1 = tw.div`
w-2/3
truncate
`;

const HeaderCol2 = tw.div`
w-1/3
`;

const List = tw.div`
`;

const Row = tw.div`
w-full
flex
p-2
text-sm
items-center
`;

const ListCol1 = tw.div`
w-8/12
truncate
pr-4
border-r
items-center
`;

const ListCol2 = tw.div`
w-3/12
items-center
border-r
self-center
text-center
`;

const ListCol3 = tw.div`
w-1/12
items-center
text-right
`;

const Button = tw.div`
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
    mt-4
`;