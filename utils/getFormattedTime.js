const getFormattedTime = (s) => {
  const hours = Math.floor(s / 3600);
  let minutes = Math.floor((s % (hours * 3600)) / 60)
  minutes = minutes < 10 ? "0" + minutes : minutes
  const formattedTime = hours + ":" + minutes + " h";
  return formattedTime;
};

export default getFormattedTime
