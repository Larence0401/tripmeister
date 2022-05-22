import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import getHotels from "../utils/getHotels";
import useGetDistanceToCityCenter from "../hooks/useGetDistanceToCityCenter";
import getEndLocation from "../utils/getEndLocation";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Icon from "@mui/material/Icon";
import HotelDetails from "./HotelDetails";
import useSortFeaturesByDistance from "../hooks/useSortFeaturesByDistance";

const Restaurants = () => {
  const { state } = useAppContext();
  const coords = state?.selectedStopData?.[1]?.["coordinates"];
  const [restaurantData, setRestaurantData] = useState([]);
  const [detailsShown, setDetailsShown] = useState(null);
  const [distance, getDistanceToCityCenter] =
    useGetDistanceToCityCenter(restaurantData);
  const [sortedFeatures, sortFeaturesByDistance] = useSortFeaturesByDistance();
  const location = getEndLocation(state.selectedStopData);
  const getRestaurantName = (el) => {
    return el?.place_name.split(",")[0];
  };

  const slideIn = state.sidebarIsOpen
    ? "translate-x-[250px] duration-300 ease-in-out"
    : "-translate-x-0 duration-300 ease-in-out";

  useEffect(() => {
    if (restaurantData?.length === 0) return;
    getDistanceToCityCenter(restaurantData);
  }, [restaurantData]);

  useEffect(() => {
    sortFeaturesByDistance(distance, restaurantData);
  }, [distance]);

  useEffect(() => {
    (async () => {
      const restaurantData = await getHotels("restaurant", coords);
      setRestaurantData(restaurantData);
    })();
  }, [state.selectedStopData]);

  return (
    <Wrapper className={slideIn}>
      {restaurantData.length > 0 && (
        <Header>
          <HeaderCol1>{`restaurants in ${location}`}</HeaderCol1>
          <HeaderCol2>distance to town center</HeaderCol2>
        </Header>
      )}
      {sortedFeatures &&
        sortedFeatures.map((el, i) => {
          return (
            <>
              <Row key={i}>
                <ListCol1>
                  {sortedFeatures.length > 0 && getRestaurantName(el.data)}
                </ListCol1>
                <ListCol2>{el.distance}</ListCol2>
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
                  address={el.data.properties.address}
                  district={el.data.context[1]["text"]}
                />
              )}
            </>
          );
        })}
    </Wrapper>
  );
};

export default Restaurants;

const Wrapper = tw.div`
    rounded-lg
    shadow-md
    box-border
    flex
    flex-col
    items-left
    bg-white
    m-8
    mx-0
    lg:m-0
    lg:mb-4
    lg-mt-8
    mb-4
    p-8
    h-auto
    lg:z-10
    w-full`;

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

const Row = tw.div`
w-full
flex
p-2
text-sm
items-center
cursor-pointer
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
