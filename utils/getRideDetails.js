
const getRideDetails = async(start,stop) => {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${stop[0]},${stop[1]}?steps=true&geometries=geojson&access_token=${process.env.mapbox_key}`,
      { method: "GET" }
    );
    const json = await query.json();
    const duration = json.routes[0].duration
    const distance = json.routes[0].distance
    
    return (
      {duration, distance}
    )
  }
  
  export default getRideDetails