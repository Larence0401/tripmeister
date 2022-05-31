import { createContext, useReducer, useContext, useMemo } from "react";
const Context = createContext();
Context.displayName = "Context";

export const useAppContext = () => useContext(Context);

export const ContextProvider = ({ children }) => {
  const initialState = {
    sidebarIsOpen: false,
    routeParams: [],
    startValue: "",
    endValue: "",
    startSuggestion: [],
    endSuggestion: "",
    itinerary: [],
    routeData: [],
    mapView: true,
    editView: false,
    deleteView: false,
    selectedStopData: [],
    routeUpdate: 0,
    startingPoint: null,
    endPoint: null,
    editStop: false, 
    editViewType: "directions",
    routeDetails : [],
    tripName: null,
    tripID: null,
    tripnameInput: false,
    readingMode: false,
    uploadRequested: false,
    downloadUrls: [],
    hotelData: [],
    restaurantData: [],
    sortedFeatures: []
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "openSidebar": {
        return {
          ...state,
          sidebarIsOpen: !state.sidebarIsOpen,
        };
      }
      case "queryRoute": {
        return {
          ...state,
          sidebarIsOpen: !state.sidebarIsOpen,
        };
      }
      case "startValue": {
        return {
          ...state,
          startValue: action.payload,
        };
      }
      case "endValue": {
        return {
          ...state,
          endValue: action.payload,
        };
      }
      case "startingPointSuggestion": {
        return {
          ...state,
          startSuggestion: action.payload,
        };
      }
      case "endPointSuggestion": {
        return {
          ...state,
          endSuggestion: action.payload,
        };
      }
      case "resetStartSuggestions": {
        return {
          ...state,
          startSuggestion: [],
        };
      }
      case "resetEndSuggestions": {
        return {
          ...state,
          endSuggestion: [],
        };
      }
      case "createStage": {
        return {
          ...state,
          itinerary: [...state.itinerary, action.payload],
        };
      }
      case "storeRouteData": {
        return {
          ...state,
          routeData: [...state.routeData, action.payload],
        };
      }
      case "updateRouteData": {
        return {
          ...state,
          routeData: action.payload,
        };
      }
      case "resetRouteData": {
        return {
          ...state,
          routeData: []
        };
      }
      case "setMapView": {
        return {
          ...state,
          mapView: action.payload,
        };
      }
      case "setEditView": {
        return {
          ...state,
          editView: action.payload,
        };
      }
      case "setDeleteView": {
        return {
          ...state,
          deleteView: action.payload,
        };
      }
      case "selectStop": {
        return {
          ...state,
          selectedStopData: action.payload,
        };
      }
      case "removeStop": {
        return {
          ...state,
          itinerary: action.payload["newItinerary"],
          routeData: action.payload["newRoute"],
        };
      }
      case "patchRoute": {
        return {
          ...state,
          itinerary: action.payload["newItinerary"],
        };
      }
      case "updateItinerary": {
        return {
          ...state,
          itinerary: action.payload
        };
      }
      case "updateRoute": {
        return {
          ...state,
          routeUpdate: state.routeUpdate + 1,
        };
      }
      case "recalculateRoute": {
        return {
          ...state,
          routeData: action.payload,
        };
      }
      case "setStartingPoint": {
        return {
          ...state,
          startingPoint: action.payload
        };
      }
      case "setEndPoint": {
        return {
          ...state,
          endPoint: action.payload
        };
      }
      case "setEditStop": {
        return {
          ...state,
          editStop: true
        };
      }
      case "setEditViewType": {
        return {
          ...state,
          editViewType: action.payload
        };
      }
      case "setRouteDetails": {
        return {
          ...state,
          routeDetails: [... state.routeDetails, action.payload]
        }
      }
      case "setTripName": {
        return {
          ...state,
          tripName: action.payload
        }
      }
      case "setTripID": {
        return {
          ...state,
          tripID: action.payload
        }
      }
      case "setTripnameInput": {
        return {
          ...state,
          tripnameInput: action.payload
        }
      }
      case "setReadingMode": {
        return {
          ...state,
          readingMode: action.payload
        }
      }
      case "requestUpload": {
        return {
          ...state,
          uploadRequested: action.payload
        }
      }
      case "setDownloadUrls": {
        return {
          ...state,
          downloadUrls: action.payload
        }
      }
      case "setHotelData": {
        return {
          ...state,
          hotelData: action.payload
        }
      }
      case "setRestaurantData": {
        return {
          ...state,
          restaurantData: action.payload
        }
      }
      case "setSortedFeatures": {
        return {
          ...state,
          sortedFeatures: action.payload
        }
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
