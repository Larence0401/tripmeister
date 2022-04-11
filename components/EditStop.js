import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppContext } from "../store/appContext";

const EditStop = () => {
  const { state,dispatch } = useAppContext();
  console.log(state.selectedStopData)
  return (
    <div>
      <ArrowBackIcon
        onClick={() => dispatch({ type: "setEditView", payload: false })}
      />
      EditStop
    </div>
  );
};

export default EditStop;
