import React from "react";
import ActivityList from "./ActivityList";
import tw from "tailwind-styled-components";
import getStartingLocation from "../utils/getStartingLocation";
import getEndLocation from "../utils/getEndLocation";
import { useAppContext } from "../store/appContext";

const Activities = () => {
  const { state } = useAppContext();
  const index = state.selectedStopData[6]["index"];
  const activities = state.itinerary[index][4]["activities"];
  const start = getStartingLocation(state.selectedStopData);
  const end = getEndLocation(state.selectedStopData);
  const filterByLocation = (loc) => {
    const arr = activities.filter((el) => el.location === loc);
    return arr;
  };
  const startList = filterByLocation(start);
  const endList = filterByLocation(end);

  return (
    <>
      {startList.length > 0 && (
        <Container>
          <Header>{`Activities in ${start}`}</Header>
          <ActivityList activities={startList} />
        </Container>
      )}
      {endList.length > 0 && (
        <Container>
          <Header>{`Activities in ${end}`}</Header>
          <ActivityList activities={endList} />
        </Container>
      )}
    </>
  );
};

export default Activities;

const Header = tw.div`
   uppercase
   bg-slate-50
   p-1
   border
   text-md
   font-semibold
   w-full
 `;

const Container = tw.div`
flex
flex-col
 `;
