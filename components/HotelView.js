import { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const HotelView = () => {
  const { state } = useAppContext();
  const [address, setAddress] = useState(null);
  const slideIn = state.sidebarIsOpen
    ? "translate-x-[250px] duration-300 ease-in-out"
    : "-translate-x-0 duration-300 ease-in-out";

  const hotelName = address
    ? state?.selectedStopData?.[3]?.text
    : "no hotel selected";
  const noSelect = address ? "" : "italic font-normal text-blue-600";

  const getAddress = () => {
    const string = state?.selectedStopData?.[3]?.place_name;
    let array = string ? string.split(",") : null;
    array ? array.shift() : null;
    array ? array.pop() : null;
    const address = array ? array.join(", ") : null;
    setAddress(address);
  };

  useEffect(() => {
    if (!state.selectedStopData?.[3]) return;
    getAddress();
  }, [state.selectedStopData]);

  return (
    <Wrapper className={slideIn}>
      <HotelName className={noSelect}>{hotelName}</HotelName>
      <div className="flex">
        {address && <LocationOnIcon size="small" className="text-slate-800" />}
        <HotelAddress>{address}</HotelAddress>
      </div>
    </Wrapper>
  );
};

export default HotelView;

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

const HotelName = tw.div`
font-semibold
mb-2
`;

const HotelAddress = tw.div`
italic
text-slate-800
`;
