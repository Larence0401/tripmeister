import { useState } from "react";
import { useAuth, db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const useGetTripData = () => {
  const user = useAuth();
  const [trip, setTrip] = useState([]);

  const getTripData = async () => {
    if (!user) return;
    const colRef = collection(db, "users", user?.uid, "itineraries");

    const unsub = onSnapshot(colRef, (snapShot) => {
      snapShot.forEach((doc) =>
        setTrip((prev) => [
          ...prev,
          { id: doc.id, tripName: doc.data().tripname },
        ])
      );
    });
  };


  return [trip, getTripData];
};

export default useGetTripData;
