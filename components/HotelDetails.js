import React from "react";
import tw from "tailwind-styled-components";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const HotelDetails = ({ address, district }) => {
  return (
    <Container>
      <LocationOnIcon className="mr-2"/>
      {`${address}, ${district}`}
    </Container>
  );
};

export default HotelDetails;

const Container = tw.div`
    shadow-md
    box-border
    p-2
    border
    text-sm
    w-full`;
