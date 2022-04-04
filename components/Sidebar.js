import React from "react";
import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";

const Sidebar = () => {
  const { state } = useAppContext();
  const slideIn = !state.sidebarIsOpen
    ? "-translate-x-[250px] duration-300 ease-in-out"
    : "-translate-x-0 duration-300 ease-in-out";

  return <Wrapper className={slideIn}>sidebar</Wrapper>;
};

export default Sidebar;

const Wrapper = tw.div`
    bg-gray-100
    z-20
    w-[250px]
    fixed
    left-0
    mt-28
    h-full`;
