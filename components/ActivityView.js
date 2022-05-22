import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import getStartingLocation from "../utils/getStartingLocation";
import getEndLocation from "../utils/getEndLocation";
import filterByLocation from "../utils/filterByLocation";

// this component lists the activities for a trip that had already been saved to the database. This component renders if the user is in watch mode.

const ActivityView = () => {
  const { state } = useAppContext();
  const start = getStartingLocation(state.selectedStopData);
  const end = getEndLocation(state.selectedStopData);
  const index = state?.selectedStopData?.[6]?.index;
  const activities = state?.itinerary?.[index]?.[4]?.["activities"];
  const slideIn = state.sidebarIsOpen
    ? "translate-x-[250px] duration-300 ease-in-out"
    : "-translate-x-0 duration-300 ease-in-out";

  const startList = filterByLocation(activities, start);
  const endList = filterByLocation(activities, end);
  startList.sort((a, b) => a.timeVal - b.timeVal).reverse();
  endList.sort((a, b) => a.timeVal - b.timeVal).reverse();
  const noActivities =
    startList.length === 0 && endList.length === 0 ? true : false;

  return (
    <Wrapper className={slideIn}>
      {startList.length > 0 && (
        <Container>
          <Header>{`Activities in ${start}`}</Header>
          {startList.map((el, i) => {
            return (
              <ListItem key={i}>
                <Activity>{`- ${el.activity}`}</Activity>
                <Time>{el.timeVal}</Time>
              </ListItem>
            );
          })}
        </Container>
      )}
      {endList.length > 0 && (
        <Container>
          <Header>{`Activities in ${end}`}</Header>
          {endList.map((el,i) => {
            return (
              <ListItem key={i + .5}>
                <Activity>{`- ${el.activity}`}</Activity>
                <Time>{el.timeVal}</Time>
              </ListItem>
            );
          })}
        </Container>
      )}
      {noActivities && (
        <h2 className="italic text-blue-600">No activities yet ...</h2>
      )}
    </Wrapper>
  );
};

export default ActivityView;

const Wrapper = tw.div`
    rounded-lg
    shadow-md
    box-border
    flex
    flex-col
    items-left
    bg-white
    m-8
    mx-0
    lg:m-0
    lg:mb-4
    lg-mt-8
    mb-4
    p-8
    h-auto
    lg:z-10
    w-full`;

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

const List = tw.ul`
   list-disc
   w-full
 `;

const ListItem = tw.li`
   p-2
   flex
   w-full
   justify-between
   border-b
   border-slate-300
   border-dashed
 `;

const TextFieldContainer = tw.div`

 mx-4
 mr-8
 my-2

 `;

const Time = tw.div`
w-2/12
 `;

const Activity = tw.div`
w-6/12
truncate
 `;
