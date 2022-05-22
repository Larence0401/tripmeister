import { useEffect } from "react";
import { useAuth } from "../firebase";
import TripItem from "./TripItem";
import useGetTripData from "../hooks/useGetTripData";

const TripList = () => {
  const user = useAuth();

  const [trip, getTripData] = useGetTripData();

  useEffect(() => {
    (async () => await getTripData())();
  }, [user]);

  return (
    <div className="w-full">
      {trip.map((el, i) => (
        <TripItem trip={el} user={user} key={i} />
      ))}
    </div>
  );
};

export default TripList;
