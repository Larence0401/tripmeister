import getBbox from "./getBBox";

const getHotels = async(type,coords) => {

    const bbox = getBbox(coords)
    const query = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${type}.json?type=poi&bbox=${bbox}&access_token=${process.env.mapbox_key}`,
      { method: "GET" }
    );
    const json = await query.json();
    const data = json.features;
    console.log(data)

    return (
      data
    )
  }
  
  export default getHotels