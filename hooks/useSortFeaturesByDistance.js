import { useState, useEffect } from "react";
import { useAppContext } from "../store/appContext";

const useSortFeaturesByDistance = () => {
  const [sortedFeatures, setSortedFeatures] = useState();
  const { state, dispatch } = useAppContext();
  const getIndex = (parsedArr) => {
    let arr = Array.from(new Set(parsedArr));
    let indices = arr.map((el) => {
      return { value: el, index: 0 };
    });
    return indices;
  };

  const updateStartIndex = (i, startIndexArr, parsedArr) => {
    const index1 = startIndexArr.findIndex((el) => el.value === a);
    startIndexArr.find(el => el.id === a).index = index + 1
  };

  const sortFeaturesByDistance = (distance, featureData) => {
    if (!distance && featureData) return;
    const distanceInKm = distance.map(el => {
      return (el.split(" ")[1] === "m" ? `${JSON.stringify(parseInt(el)/1000)} km` : el)
      
    })

    const parsedArr = distanceInKm.map((el) => {
      const num = parseFloat(el.split(" ")[0]);
      return num;
    });
    console.log(parsedArr)
    let sortedArr = JSON.parse(JSON.stringify(parsedArr));
    sortedArr = sortedArr.sort((a, b) => a - b);
    let arrOfIndices = Array(parsedArr.length).fill(0);
    let startIndexArr = getIndex(parsedArr);
    
    arrOfIndices = arrOfIndices.map((el, i) => {
      const a = parsedArr[i];
      let startIndex = startIndexArr.find(it => it.value === a).index
      const index = sortedArr.indexOf(a,startIndex);
      startIndexArr.find(it => it.value === a).index = index + 1
      return index;
    });
    let newArr = Array(parsedArr.length).fill(0);
    const sortedFeatures = newArr.map((el, i) => {
      const index = arrOfIndices.findIndex((it) => it === i);
      return { data: featureData[index], distance: distance[index] };
    });
    setSortedFeatures(sortedFeatures);
    dispatch({type: 'setSortedFeatures', payload: sortedFeatures})
  };

  return [sortedFeatures, sortFeaturesByDistance];
};

export default useSortFeaturesByDistance;
