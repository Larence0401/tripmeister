import {useState, useEffect} from "react";
import tw from "tailwind-styled-components";
import getRideDetails from "../utils/getRideDetails";
import { useAppContext } from "../store/appContext";
import getFormattedTime from "../utils/getFormattedTime";

const TripStats = () => {
  const { dispatch, state } = useAppContext();
  const [rideDetails, setRideDetails] = useState("")
  const start = state?.selectedStopData?.[0]?.['coordinates']
  const end = state?.selectedStopData?.[1]?.['coordinates']
  const duration = rideDetails !== "" ? getFormattedTime(rideDetails.duration) : ""
  const distance = rideDetails !== "" ? Math.floor(rideDetails.distance / 1000) + " km" : ""
  const day = state?.selectedStopData?.[5]?.['index'] + 1
  const days = state?.itinerary?.length 


  useEffect(() => {
    if(!start || !end) return
    (async () => {
      const details = await getRideDetails(start, end)
      setRideDetails(details)
    })()
  },[start,stop])

  console.log()

  return (
    <Wrapper>
      <Header>{`Day ${day} / ${days} (Berlin - München)`}</Header>
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
          <Value>110km</Value>
        </Row>
        <Row className="bg-[rgb(247,247,247)]">
          <Spec>avg. driving time / day</Spec>
          <Value>2.20h </Value>
        </Row>
        <Row>
          <Spec>total trip length</Spec>
          <Value>550 km</Value>
        </Row>
        <Row className="bg-[rgb(247,247,247)]">
          <Spec>total driving time</Spec>
          <Value>15 h </Value>
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
    mb-4
    p-8
    h-auto
    w-full`;

    const Header = tw.div`
    w-full
    rounded-md
    text-lg
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
