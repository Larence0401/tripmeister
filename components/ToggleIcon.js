import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";

const ToggleIcon2 = () => {
    const {state, dispatch} = useAppContext()
    const open1 = state.sidebarIsOpen ? "top-[18px] w-[0%] l-[50%]" : null
    const open2 = state.sidebarIsOpen ? "rotate-[45deg]" : null
    const open3 = state.sidebarIsOpen ? "rotate-[-45deg]" : null
    const open4 = state.sidebarIsOpen ? "top-[12px] w-[0%] l-[50%]" : null

  return (
    <Hamburger onClick={() => dispatch({type: 'openSidebar'})}>
      <Bar className={`top-0 ${open1}`}></Bar>
      <Bar className={`top-[12px] ${open2}`}></Bar>
      <Bar className={`top-[12px] ${open3}`}></Bar>
      <Bar className={`top-[24px] ${open4}`}></Bar>
    </Hamburger>
  );
};

export default ToggleIcon2;

const Hamburger = tw.div`
    w-[40px]
    h-[30px]
    relative
    z-90
    pointer
    rotate-[0deg]
    ease-out
    duration-500
    m-[50px auto]
`

const Bar = tw.div`
block
absolute
h-[6px]
w-full
bg-white
rounded-[6px]
opacity-100
left-[0]
transition-all
duration-250
ease-in-out
`;
