import Head from "next/head";
import { useEffect } from "react";
import tw from "tailwind-styled-components";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import Search from "../components/Search";
import dynamic from "next/dynamic";
import Itinerary from "../components/Itinerary";
import { useAppContext } from "../store/appContext";
import ActivityView from "../components/ActivityView";
import EditNotes from "../components/EditNotes";
import TripStats from "../components/TripStats";
import Upload from "../components/Upload";
import Hotel from "../components/Hotel";
import HotelView from "../components/HotelView";
import Restaurants from "../components/Restaurants";
import { useAuth, createUser } from "../firebase";


const Main = dynamic(() => import("../components/Main"), {
  ssr: false,
});

const TravelDocs = dynamic(() => import("../components/TravelDocs"), {
  ssr: false,
});

const MapComponent = dynamic(() => import("../components/Map"), {
  loading: () => "Loading...",
  ssr: false,
});

const EditViewSelect = dynamic(() => import("../components/EditViewSelect"), {
  loading: () => "Loading...",
  ssr: false,
});

export default function Home() {
  const { state } = useAppContext();
  const user = useAuth();

  useEffect(() => {
    if (!user) return;
    (async () => await createUser(user))();
  }, [user]);

  return (
    <Wrapper>
      <Head>
        <title>Tripmeister | travel planning app</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="tripmeister - a free travel planning app"
        />
        <link
          href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.7.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <Header />
      <Sidebar />
      <Main>
        <Container>
          {!state.readingMode && (
            <>
              {state.editViewType === "directions" && <Search />}
              {state.editViewType === "hotel" && <Hotel id="hotel" />}
              {state.editViewType === "notes" && <EditNotes id="notes" />}
              {state.editViewType === "info" && <TripStats id="stats" />}
              {state.editViewType === "upload" && <Upload id="upload" />}
            </>
          )}
          {state.readingMode && (<>
            {state.editViewType === "hotel" && <HotelView/>}
            {state.editViewType === "notes" && <ActivityView/> }
            {state.editViewType === "info" && <TripStats id="stats" />}
            {state.editViewType === "upload" && <TravelDocs />}
            {state.editViewType === "restaurants" && <Restaurants/>}
          </>)}

          {(state.editView || state.readingMode) && <EditViewSelect />}
          {state.itinerary.length > 0 && (
            <div className="hidden lg:flex z-40 w-full">
              <Itinerary />
            </div>
          )}
        </Container>
        {state.mapView ? <MapComponent /> : <Itinerary />}
      </Main>
    </Wrapper>
  );
}

const Wrapper = tw.div`
    flex
    items-center
    justify-center
    flex-col
    w-full
    h-screen
    bg-slate-50
    lg:m-0
`;

const Container = tw.div`
lg:flex
lg:flex-col
justify-center
items-center
w-full
mx-0
    lg:absolute
    lg:top-0
    lg:mt-20
    lg:left-0
    lg:w-1/4
    lg:z-50
    lg:ml-8
    z-0
`;
