import React from "react";
import tw from "tailwind-styled-components";
import ToggleIcon from "./ToggleIcon";
import { useAppContext } from "../store/appContext";


const Header = () => {
  const { state } = useAppContext();
  return (
    <Wrapper>
      <ToggleIcon />
      {state.tripName && (
        <TripName>{state.tripName}</TripName>
      )}
    </Wrapper>
  );
};

export default Header;

const Wrapper = tw.div`
    flex
    w-full
    h-14
    z-20
    bg-rose-500
    border-bg
    border-rose-800
    shadow-md
    fixed
    top-0
    left-0
    mb-8
    items-center
    pl-2
`;

const TripName = tw.div`
    text-white
    self-center
    ml-12
    uppercase
`;
