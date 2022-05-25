import { useEffect } from "react";
import { useAuth } from "../firebase";
import TripItem from "./TripItem";
import useGetTripData from "../hooks/useGetTripData";

const TripList = () => {
  const user = useAuth();

  const [trip, getTripData] = useGetTripData();

  console.log(trip);
  const removeDuplicates = (trip) =>
    Array.from(new Set(trip.map((el) => el.id))).map((id) => {
      return trip.find((el) => el.id === id);
    });
    
  const tripArray = removeDuplicates(trip);
  console.log(tripArray);

  useEffect(() => {
    (async () => await getTripData())();
  }, [user]);

  return (
    <div className="w-full">
      {tripArray.map((el, i) => (
        <TripItem trip={el} user={user} key={i} />
      ))}
    </div>
  );
};

export default TripList;
