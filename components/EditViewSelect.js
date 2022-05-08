import { useEffect } from "react";
import tw from "tailwind-styled-components";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import NotesIcon from "@mui/icons-material/Notes";
import HotelIcon from "@mui/icons-material/Hotel";
import InfoIcon from "@mui/icons-material/Info";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SaveIcon from "@mui/icons-material/Save";
import { useAppContext } from "../store/appContext";
import SaveTrip from "./SaveTrip";

const EditViewSelect = () => {
  const { state, dispatch } = useAppContext();
  const isIntraDayTrip = !state.selectedStopData[5].stayOvernight;

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
    <Container>
      {!state.tripnameInput && (
        <>
          <IconContainer className="icon_container">
            <DirectionsCarIcon
              onClick={(e) => handleClick(e)}
              id="directions"
            />
          </IconContainer>
          {!isIntraDayTrip && (
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
          <IconContainer className="icon_container">
            <FileUploadIcon onClick={(e) => handleClick(e)} id="upload" />
          </IconContainer>
        </>
      )}

      <SaveTrip />

      {/* <IconContainer className="icon_container">
            <DirectionsCarIcon
              onClick={(e) => handleClick(e)}
              id="directions"
            />
          </IconContainer>
          {!isIntraDayTrip && (
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
          <IconContainer className="icon_container">
            <FileUploadIcon onClick={(e) => handleClick(e)} id="upload" />
          </IconContainer>
          <SaveTrip /> */}
    </Container>
  );
};

export default EditViewSelect;

const Container = tw.div`
    relative
    flex
    w-full
    justify-around
    `;

const IconContainer = tw.div`
    flex
    justify-center
    items-center
    p-2
    rounded-full
    bg-white
    box-border
    `;
