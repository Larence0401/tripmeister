import { useState, useEffect } from "react";

const useSortFeaturesByDistance = () => {
  const [sortedFeatures, setSortedFeatures] = useState();

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
    const parsedArr = distance.map((el) => {
      const num = parseFloat(el.split(" ")[0]);
      return num;
    });
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
  };

  return [sortedFeatures, sortFeaturesByDistance];
};

export default useSortFeaturesByDistance;
