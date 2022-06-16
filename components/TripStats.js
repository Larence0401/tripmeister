import {useState, useEffect} from "react";
import tw from "tailwind-styled-components";
import getRideDetails from "../utils/getRideDetails";
import { useAppContext } from "../store/appContext";
import getFormattedTime from "../utils/getFormattedTime";
import getStartingLocation from "../utils/getStartingLocation";
import getEndLocation from "../utils/getEndLocation";
import getDateDifference from "../utils/getDateDifference";

const TripStats = () => {
  const { state } = useAppContext();
  const [rideDetails, setRideDetails] = useState("")
  const [totalDuration, setTotalDuration] = useState("")
  const [totalDistance, setTotalDistance] = useState("")
  const start = state?.selectedStopData?.[0]?.['coordinates']
  const end = state?.selectedStopData?.[1]?.['coordinates']
  const duration = rideDetails !== "" ? getFormattedTime(rideDetails.duration) : ""
  const distance = rideDetails !== "" ? Math.floor(rideDetails.distance / 1000) + " km" : ""
  const totalDur = totalDuration === "" ? "" : getFormattedTime(totalDuration)
  const totalDist = totalDistance !== "" ? Math.floor(totalDistance / 1000) + " km" : ""
  const index = state?.selectedStopData?.[6]?.['index'] 
  const date1 = state.itinerary?.[0]?.[2]
  const date2 = state.itinerary?.[index]?.[2]
  const day = getDateDifference(date1,date2)
  const lastDay = state.itinerary?.[state?.itinerary.length-1]?.[2]
  const days = getDateDifference(date1,lastDay)
  const avgDuration = getFormattedTime(totalDuration / days) 
  const avgDistance = Math.floor(totalDistance / days / 1000) + " km"
  const section = " (" + getStartingLocation(state.selectedStopData) + " - " + getEndLocation(state.selectedStopData) + ")"
  const slideIn = state.sidebarIsOpen
  ? "translate-x-[250px] duration-300 ease-in-out"
  : "-translate-x-0 duration-300 ease-in-out";

  const getTotalValue = async(type) => {
      const result = state.itinerary.map(async(el) => {
        const start = el[0]['coordinates']
        const end = el[1]['coordinates']
        const values = await getRideDetails(start, end)
        return values[type]
      })
      const array = await Promise.all(result)
      const totalValue = array.reduce((a, b) => a + b)
      type === "distance" ? setTotalDistance(totalValue) : setTotalDuration(totalValue)
  }


  useEffect(() => {
    if(!start || !end) return
    (async () => {
      const details = await getRideDetails(start, end)
      setRideDetails(details)
      getTotalValue("duration")
      getTotalValue("distance")
      getDateDifference(date1,date2)
      getStartingLocation(state.selectedStopData)
      getEndLocation(state.selectedStopData)
    })()
  },[start,stop,state.itinerary,state.selectedStopData])

  return (
    <Wrapper className={slideIn}>
      <Header>{`Day ${day} / ${days} ${section}`}</Header>
      <Table>
        <Row>
          <Spec>ride duration</Spec>
          <Value>{duration}</Value>
        </Row>
        <Row className="bg-[rgb(247,247,247)]">
          <Spec>route length</Spec>
          <Value>{distance}</Value>
        </Row>
        <Row>
          <Spec>avg. km / day</Spec>
          <Value>{avgDistance}</Value>
        </Row>
        <Row className="bg-[rgb(247,247,247)]">
          <Spec>avg. driving time / day</Spec>
          <Value>{avgDuration}</Value>
        </Row>
        <Row>
          <Spec>total trip length</Spec>
          <Value>{totalDist}</Value>
        </Row>
        <Row className="bg-[rgb(247,247,247)]">
          <Spec>total driving time</Spec>
          <Value>{totalDur}</Value>
        </Row>
      </Table>
    </Wrapper>
  );
};

export default TripStats;

const Wrapper = tw.div`
    rounded-lg
    shadow-md
    box-border
    flex
    flex-col
    items-start
    bg-white
    m-8
    mx-0
    mb-4
    p-8
    h-auto
    w-full`;

    const Header = tw.div`
    w-full
    rounded-md
    text-base
    lg:text-lg
    font-semibold
    bg-slate-600
    text-slate-50
    text-center
    p-2
    uppercase
    truncate
    mb-4
`;

const Table = tw.div`
    w-full
    h-full
    flex
    flex-col
`;

const Row = tw.div`
    w-full
    h-full
    flex
    py-2
    pl-2
`;

const Spec = tw.div`
    w-2/3
`;

const Value = tw.div`
    w-1/3
    italic
`;
