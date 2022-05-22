const filterByLocation = (activities,loc) => {
    const arr = activities.filter((el) => el.location === loc);
    return arr;
  };

  export default filterByLocation