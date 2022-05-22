const formatDistance = (dist) => {
  const output =
    dist < 1000
      ? Math.floor(dist) + " m"
      : Math.floor(dist / 1000) + "." + (dist % 1000).toString()[0] + " km";
  return output;
};

export default formatDistance