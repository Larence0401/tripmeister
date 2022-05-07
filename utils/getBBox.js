const getBbox = (coords) => {
    const minLon = coords[0] - 0.05
    const minLat = coords[1] - 0.05
    const maxLon = coords[0] + 0.05
    const maxLat = coords[1] + 0.05
    return [minLon, minLat, maxLon, maxLat]
}

export default getBbox