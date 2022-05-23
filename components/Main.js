import React from "react";
import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";

const Main = ({ children }) => {
  const { state, dispatch } = useAppContext();
  const isHidden = state.sidebarIsOpen && window.innerWidth <= 1024 ? "hidden" : ""

  return (
    <Wrapper className={isHidden}>
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
    p-4
    p-8
    lg:p-0
    lg:pt-12
    pt-12
    flex
    flex-col
    items-center
    w-full
    h-full
    z-0`;

const Headline = tw.h2`
    lg:hidden
    px-8
    pt-6
    md:pt-8
    lg:text-lg
    text-slate-800
    uppercase
    italic
    font-semibold
    flex`;
