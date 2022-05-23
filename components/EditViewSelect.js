import { useEffect } from "react";
import tw from "tailwind-styled-components";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import NotesIcon from "@mui/icons-material/Notes";
import HotelIcon from "@mui/icons-material/Hotel";
import InfoIcon from "@mui/icons-material/Info";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { useAppContext } from "../store/appContext";
import SaveTrip from "./SaveTrip";

// This component renders in edit and in view mode. Depending on whether the user is in edit mode or in view mode, different icons git displayed. Those icons bring uploadRequested
//different components when clicked

const EditViewSelect = () => {
  const { state, dispatch } = useAppContext();
  const isIntraDayTrip = !state?.selectedStopData?.[5]?.stayOvernight;
  const slideIn = state.sidebarIsOpen
    ? "translate-x-[250px] duration-300 ease-in-out"
    : "-translate-x-0 duration-300 ease-in-out";

  const handleClick = (e) => {
    dispatch({ type: "setEditViewType", payload: e.currentTarget.id });
    const icons = document.querySelectorAll(".icon_container");
    icons.forEach((icon) => icon.classList.remove("active"));
  };

  const setButtonActive = () => {
    const activeButton = document.getElementById(state.editViewType).parentNode;
    activeButton.classList.add("active");
  };

  useEffect(() => {
    setButtonActive();
  }, [state.editViewType]);

  return (
    <Container className={slideIn}>
      {!state.uploadRequested && (
        <>
          {!state.tripnameInput && (
            <>
              {!state.readingMode && (
                <IconContainer className="icon_container">
                  <DirectionsCarIcon
                    onClick={(e) => handleClick(e)}
                    id="directions"
                  />
                </IconContainer>
              )}

              {(!isIntraDayTrip || state.readingMode) && (
                <IconContainer className="icon_container">
                  <HotelIcon onClick={(e) => handleClick(e)} id="hotel" />
                </IconContainer>
              )}
              <IconContainer className={"icon_container"}>
                <NotesIcon onClick={(e) => handleClick(e)} id="notes" />
              </IconContainer>
              <IconContainer className="icon_container">
                <InfoIcon onClick={(e) => handleClick(e)} id="info" />
              </IconContainer>
              {!state.readingMode ? (
                <IconContainer className="icon_container">
                  <FileUploadIcon onClick={(e) => handleClick(e)} id="upload" />
                </IconContainer>
              ) : (
                <IconContainer className="icon_container">
                  <FileOpenIcon onClick={(e) => handleClick(e)} id="upload" />
                </IconContainer>
              )}
              {state.readingMode && (
                <IconContainer className="icon_container">
                  <RestaurantIcon onClick={(e) => handleClick(e)} id="restaurants" />
                </IconContainer>
              )}
            </>
          )}
        </>
      )}

      {!state.readingMode && <SaveTrip />}
    </Container>
  );
};

export default EditViewSelect;

const Container = tw.div`
    relative
    flex
    w-full
    justify-around
    mb-4
    md:mb-0
    `;

const IconContainer = tw.div`
    flex
    justify-center
    items-center
    p-2
    rounded-full
    bg-white
    hover:bg-[rgb(247,247,247)]
    cursor-pointer
    box-border
    `;
