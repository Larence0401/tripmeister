import React from "react";
import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";

const Main = ({ children }) => {
  const { state, dispatch } = useAppContext();
  return (
    <Wrapper>
      {state.itinerary.length === 0 && (
        <Headline>Start planning your trip ...</Headline>
      )}

      {children}
    </Wrapper>
  );
};

export default Main;

const Wrapper = tw.div`
    bg-slate-200
    p-8
    pt-12
    flex
    flex-col
    items-center
    w-full
    h-full`;

const Headline = tw.h2`
    px-8
    pt-8
    text-lg
    text-slate-800
    uppercase
    italic
    font-semibold
    flex`;
