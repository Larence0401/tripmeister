import { useEffect } from "react";
import { useAppContext } from "../store/appContext";

const useUpdateHotel = (start) => {
  const { state, dispatch } = useAppContext();

  const updateHotel = () => {
    const newHotel = start ? start : state.startValue;
    if (newHotel === "") return;
    const index = state.selectedStopData[6]["index"];
    const arr = [...state.itinerary];
    arr[index].splice(3, 1, newHotel);
    dispatch({ type: "updateItinerary", payload: arr });
  };

  useEffect(() => {
    updateHotel();
  }, []);

  return updateHotel;
};

export default useUpdateHotel;
