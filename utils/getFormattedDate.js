import { format } from "date-fns";

const getFormattedDate = item => format(item[2], "dd MMM")

export default getFormattedDate