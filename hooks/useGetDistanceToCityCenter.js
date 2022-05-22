import { useState, useEffect } from "react";
import { useAppContext } from "../store/appContext";
import getRideDetails from "../utils/getRideDetails";
import formatDistance from "../utils/formatDistance";

const useGetDistanceToCityCenter = (hotelData) => {
  const { state } = useAppContext()
    const [distance, setDistance] = useState()
    const coords = state?.selectedStopData?.[1]?.["coordinates"];

  const getDistanceToCityCenter = async (hotelData) => {
    if (!hotelData) return;
    console.log(hotelData)
    const result = hotelData.map(async (el) => {
      const end = el.center;
      const data = await getRideDetails(coords, end);
      const dist = data.distance;
      const output = formatDistance(dist);
      return output;
    });
    const array = await Promise.all(result);
    setDistance(array);
  };

  useEffect(() => {
    getDistanceToCityCenter()
  },[])

  return [distance, getDistanceToCityCenter]
};

export default useGetDistanceToCityCenter;
