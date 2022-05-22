import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import useGetTripData from "../hooks/useGetTripData";
import { useAuth } from "../firebase";

const TravelDocs = () => {
  const { state } = useAppContext();
  const storage = getStorage();
  const [trip, getTripData] = useGetTripData();
  const [docs, setDocs] = useState([]);
  const [urls, setUrls] = useState([]);
  const user = useAuth();
  const current_trip = trip.filter((el) => el.tripName === state.tripName);
  const listRef = ref(storage, current_trip?.[0]?.id);

  const slideIn = state.sidebarIsOpen
    ? "translate-x-[250px] duration-300 ease-in-out"
    : "-translate-x-0 duration-300 ease-in-out";

  const getFileNames = async () => {
    const data = await listAll(listRef);
    data.items.forEach((el) => {
      const path = el?._location?.path_;
      const fileName = path.split("/")[1];
      setDocs((prev) => [...prev, fileName]);
    });
  };

  const getDownloadURLs = async () => {
    const result = docs.map(async (el) => {
      const fileRef = ref(storage, `${current_trip[0].id}/${el}`);
      const url = await getDownloadURL(fileRef);
      return url;
    });
    const urls = await Promise.all(result);
    setUrls(urls);
  };

  const handleClick = async (i) => {
    window.open(urls[i]);
  };

  useEffect(() => {
    (async () => await getTripData())();
  }, [user]);

  useEffect(() => {
    (async () => await getFileNames())();
  }, [trip]);

  useEffect(() => {
    (async () => await getDownloadURLs())();
  }, [docs]);

  return (
    <Wrapper className={slideIn}>
      <Header>Your travel documents</Header>
      <FileList>
        {docs.map((el, i) => {
          return (
            <File key={i} onClick={() => handleClick(i)}>
              {el}
            </File>
          );
        })}
      </FileList>
    </Wrapper>
  );
};

export default TravelDocs;

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
mb-4
font-semibold
`;

const FileList = tw.div`
flex
flex-col
`;

const File = tw.a`
text-blue-500
hover:text-blue-700
hover:italic
cursor-pointer
py-1
`;
