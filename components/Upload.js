import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { useAppContext } from "../store/appContext";
import { DropzoneArea } from "react-mui-dropzone";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import useGetTripData from "../hooks/useGetTripData";
import { useAuth } from "../firebase";
import { useRouter } from "next/router";

const Upload = () => {
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const [no, setNo] = useState(0);
  const user = useAuth();
  const slideIn = state.sidebarIsOpen
    ? "translate-x-[250px] duration-300 ease-in-out"
    : "-translate-x-0 duration-300 ease-in-out";

  const useStyles = makeStyles((theme) =>
    createStyles({
      previewChip: {
        minWidth: 160,
        maxWidth: 210,
      },
    })
  );
  const [trip, getTripData] = useGetTripData();

  const uploadFile = async (files) => {
    await getTripData();
    const current_trip = trip.filter((el) => el.tripName === state.tripName);
    const storage = getStorage();
    const path = `${(storage, current_trip?.[0]?.id)}/${files?.[no - 1]?.name}`;
    const docRef = ref(storage, path);
    const file = files?.[no - 1];
    await uploadBytes(docRef, file);
    setNo((prev) => prev + 1);
  };

  const classes = useStyles();

  const handleChange = async (files) => {
    if (!user) router.push("/login");
    if (!state.tripName && files.length > 0)
      await dispatch({ type: "requestUpload", payload: true });
    await uploadFile(files);
  };

  useEffect(() => {
    if (!state.tripName) return;
    (async () => await getTripData())();
    setNo(0);
  }, [state.tripName]);

  return (
    <Wrapper className={slideIn}>
      <Message>
        Upload your tickets, booking confirmations and vouchers here ...
      </Message>
      {!state.uploadRequested && (
        <DropzoneArea
          showPreviews={true}
          showPreviewsInDropzone={false}
          useChipsForPreview
          previewGridProps={{ container: { spacing: 1, direction: "row" } }}
          previewChipProps={{ classes: { root: classes.previewChip } }}
          previewText="Selected files"
          onChange={async (files) => await handleChange(files)}
        />
      )}
      {state.uploadRequested && (
        <SaveAlert>
          Please save this trip below before uploading documents!
        </SaveAlert>
      )}
    </Wrapper>
  );
};

export default Upload;

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

const Message = tw.div`
  mb-4
  italic
  text-lg
  text-blue-700
`;

const SaveAlert = tw.div`
  bg-red-300
  p-4
  text-center
`;
