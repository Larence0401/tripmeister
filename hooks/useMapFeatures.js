import { useState } from "react";
import { useAppContext } from "../store/appContext";
import getColors from "../utils/getColors";
import { Marker } from "react-map-gl";

const useMapFeatures = (hotelSelected) => {
  const [features, setFeatures] = useState([]);
  const { state } = useAppContext();

  const mapFeatures = () => {
    if (state.sortedFeatures.length < 1) return;

    if (
      (state.editViewType !== "hotel" &&
        state.editViewType !== "restaurants") ||
      hotelSelected
    ) {
      setFeatures([]);
      return;
    }
    setFeatures([]);
    const colors = getColors();
    if (
      state.sortedFeatures.length > 0 && !hotelSelected &&
      (state.editViewType === "hotel" || state.editViewType === "restaurants")
    ) {
      const result = state.sortedFeatures.map((el, index) => (
        <Marker
          color={colors[index]}
          longitude={el.data.center[0]}
          latitude={el.data.center[1]}
          key={index}
        />
      ));
      hotelSelected ? setFeatures([]) : setFeatures(result);
    }
  };

  return [features, mapFeatures];
};

export default useMapFeatures;
