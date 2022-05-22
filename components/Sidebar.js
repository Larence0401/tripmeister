import { useState } from "react";
import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { signOutUser, useAuth } from "../firebase";
import Link from "next/link";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TripList from "./TripList";
import CreateNewTrip from "./CreateNewTrip";

const Sidebar = () => {
  const { state } = useAppContext();
  const slideIn = !state.sidebarIsOpen
    ? "-translate-x-[250px] duration-300 ease-in-out"
    : "-translate-x-0 duration-300 ease-in-out";

  const user = useAuth();
  const [tripsShown, setTripsShown] = useState(false);


  return (
    <Wrapper className={slideIn}>
      {user && (
        <p className="text-white mb-4">{`Hello, ${user.displayName}`}</p>
      )}
      {user ? (
        <MenuItem onClick={signOutUser}>
          <span>Logout</span>
          <LogoutIcon className="ml-4 text-lg" />
        </MenuItem>
      ) : (
        <Link href="/login">
          <a>
            <MenuItem>
              <span>LogIn</span>
              <LoginIcon className="ml-4 text-lg" />
            </MenuItem>
          </a>
        </Link>
      )}
      <CreateNewTrip />
      {user && (
        <MenuItem onClick={() => setTripsShown((prev) => !prev)}>
          My trips
          {!tripsShown ? (
            <ArrowRightIcon className="ml-2" />
          ) : (
            <ArrowDropDownIcon className="ml-2" />
          )}
        </MenuItem>
      )}

      {tripsShown && <TripList />}
    </Wrapper>
  );
};

export default Sidebar;

const Wrapper = tw.div`
flex
flex-col
items-start
bg-slate-600
opacity-90
    p-6
    z-40
    w-[250px]
    fixed
    left-0
    mt-28
    h-full`;

const LogInout = tw.div`
z-50
mb-4
text-white
cursor-pointer
uppercase
    flex
    items-center`;

const MenuItem = tw.div`
    text-white
    uppercase
    border-b
    border-slate-400
    py-4
    flex
    items-center
    w-full
    hover:bg-slate-700
    cursor-pointer
    `;
