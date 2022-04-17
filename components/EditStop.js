import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppContext } from "../store/appContext";
import getFormattedDate from "../utils/getFormattedDate";
import getEndLocation from "../utils/getEndLocation";
import getStartingLocation from "../utils/getStartingLocation";
import tw from "tailwind-styled-components";
import EditIcon from "@mui/icons-material/Edit";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DestinationInput from "./DestinationInput";

const EditStop = () => {
  const { state, dispatch } = useAppContext();
  const [date, setDate] = useState(state.selectedStopData[2]);
  const [isInputField, setIsInputField] = useState({
    startField: false,
    endField: false,
    dateField: false,
  });
  const stage_date = getFormattedDate(state.selectedStopData);
  const endPoint = getEndLocation(state.selectedStopData);
  const startingPoint = getStartingLocation(state.selectedStopData);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const fetchSearchResult = async (input) => {
    const location = input === "starting" ? state.startValue : state.endValue;

    if (state.startValue.length < 2) return;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${process.env.mapbox_key}&autocomplete=true`
    );
    const results = await response.json();
    if (!results) return;
    dispatch({ type: `${input}PointSuggestion`, payload: results.features });
  };

  useEffect(() => {
    fetchSearchResult("starting");
  }, [state.startValue]);

  useEffect(() => {
    //fetchSearchResult("end");
  }, [state.endValue]);

  return (
    <Wrapper>
      <ArrowBackIcon
        onClick={() => dispatch({ type: "setEditView", payload: false })}
      />
      <Container>
        <Row>
          {state.startValue.length < 3 && <LeftCol>From</LeftCol>}
          {isInputField.startField ? (
            <DestinationInput
              inputType="startValue"
              setIsInputField={setIsInputField}
            />
          ) : (
            <>
              <Location>{state.startingPoint ? state.startingPoint : startingPoint}</Location>
              <Edit
                onClick={() =>
                  setIsInputField({
                    ...isInputField,
                    endField: false,
                    startField: true,
                    dateField: false,
                  })
                }
              >
                <EditIcon />
              </Edit>
            </>
          )}
        </Row>
        <Row>
          <LeftCol>To</LeftCol>
          {isInputField.endField ? (
            <DestinationInput inputType="endValue" setEnd={setEnd} />
          ) : (
            <>
              <Location>{endPoint}</Location>
              <Edit
                onClick={() =>
                  setIsInputField({
                    ...isInputField,
                    endField: true,
                    startField: false,
                    dateField: false,
                  })
                }
              >
                <EditIcon />
              </Edit>
            </>
          )}
        </Row>
        <Row
          onClick={() =>
            setIsInputField({
              ...isInputField,
              endField: false,
              startField: false,
              dateField: true,
            })
          }
        >
          <LeftCol>On</LeftCol>
          <DateContainer>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              showTimeSelect
              dateFormat="dd.MM.yyyy"
            />
          </DateContainer>
          <Edit>
            <EditIcon />
          </Edit>
        </Row>
      </Container>
    </Wrapper>
  );
};

export default EditStop;

const Wrapper = tw.div`
relative
flex
flex-col
items-start
w-full
h-full`;

const Container = tw.div`
    text-slate-700
    mt-12
    relative
    flex
    flex-col
    h-full`;
const Row = tw.div`
    w-full
    flex
    mb-8
    leading-10
    uppercase
`;

const LeftCol = tw.div`
w-1/4
text-right
pr-8
uppercase
font-semibold
`;

const Location = tw.div`
    italic
      `;

const Edit = tw.div`
  flex
  items-center
  text-slate-700
  text-xs
  z-20
  pl-4
`;

const DateContainer = tw.div`
      w-1/4`;
