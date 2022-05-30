import { useState, useEffect } from "react";
import { useAppContext } from "../store/appContext";
import getColors from "../utils/getColors";
import { Marker } from "react-map-gl";


const useMapFeatures = () => {
  const [features, setFeatures] = useState([]);
  const { state } = useAppContext();


  const mapFeatures = (featureType) => {
    const featureData =
    featureType === "hotel" ? state.hotelData : state.restaurantData;
    if (state.editViewType !== ("hotel" || "restaurants")) {
      setFeatures([]);
      return;
    }
    setFeatures([]);
    const colors = getColors();
    if (featureData.length > 0 && state.editViewType === featureType) {
      const result = featureData.map((el, index) => (
        <Marker
          color={colors[index]}
          longitude={el.center[0]}
          latitude={el.center[1]}
          key={index}
        />
      ));
      setFeatures(result);
    }
  };


  return [features, mapFeatures];
};

export default useMapFeatures;
