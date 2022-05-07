import React from "react";
import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { signOutUser, useAuth } from "../firebase";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";

const Sidebar = () => {
  const { state } = useAppContext();
  const slideIn = !state.sidebarIsOpen
    ? "-translate-x-[250px] duration-300 ease-in-out"
    : "-translate-x-0 duration-300 ease-in-out";

  const user = useAuth();
  console.log(user);

  return (
    <Wrapper className={slideIn}>
      {user && (
        <p className="text-white mb-4">{`Hello, ${user.displayName}`}</p>
      )}
      {user ? (
        <LogInout onClick={signOutUser}>
          <span className="text-lg">Logout</span>
          <LogoutIcon className="text-white ml-4" />
        </LogInout>
      ) : (
        <Link href="/login">
          <a>
            <LogInout>
              <span className="text-lg">LogIn</span>
              <LoginIcon className="text-white ml-4" />
            </LogInout>
          </a>
        </Link>
      )}
      <MenuItem>
        add new trip
        <AddIcon className="ml-2"/>
      </MenuItem>
    </Wrapper>
  );
};

export default Sidebar;

const Wrapper = tw.div`
flex
flex-col
items-end
bg-slate-600
opacity-90
    p-8
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
border-y
border-slate-200
py-1
flex
items-center
w-full
hover:bg-slate-700
`;
