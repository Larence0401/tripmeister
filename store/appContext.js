import { createContext, useReducer, useContext, useMemo } from "react"
const Context = createContext()
Context.displayName = "Context"

export const useAppContext = () => useContext(Context)

export const ContextProvider = ({ children }) => {
    const initialState = {
        sidebarIsOpen: false,
        routeParams: [],
        startValue: '',
        endValue: '',
        startSuggestion: [],
        endSuggestion: '',
        itinerary: [],
        routeData: [],
        mapView: true,
        editView: false,
        deleteView: false,
        selectedStopData: []
    }

const reducer = (state,action) => {
    switch(action.type) {
        case 'openSidebar' : {
            return {
                ...state,
                sidebarIsOpen: !state.sidebarIsOpen
            }
        }
        case 'queryRoute' : {
            return {
                ...state,
                sidebarIsOpen: !state.sidebarIsOpen
            }
        }
        case 'startValue' : {
            return {
                ...state,
                startValue: action.payload
            }
        }
        case 'endValue' : {
            return {
                ...state,
                endValue: action.payload
            }
        }
        case 'startingPointSuggestion' : {
            return {
                ...state,
                startSuggestion: action.payload
            }
        }
        case 'endPointSuggestion' : {
            return {
                ...state,
                endSuggestion: action.payload
            }
        }
        case 'resetStartSuggestions' : {
            return {
                ... state,
                startSuggestion: []
            }
        }
        case 'resetEndSuggestions' : {
            return {
                ... state,
                endSuggestion: []
            }
        }
        case 'createStage' : {
            return {
                ... state,
                itinerary: [...state.itinerary, action.payload]
            }
        }
        case 'storeRouteData' : {
            return {
                ... state,
                routeData: [...state.routeData, action.payload]
            }
        }
        case 'setMapView' : {
            return {
                ... state,
                mapView: action.payload
            }
        }
        case 'setEditView' : {
            return {
                ... state,
                editView: action.payload
            }
        }
        case 'setDeleteView' : {
            return {
                ... state,
                deleteView: action.payload
            }
        }
        case 'selectStop' : {
            return {
                ... state,
                selectedStopData: action.payload
            }
        }
        case 'removeStop' : {
            return {
                ... state,
                itinerary: action.payload['newItinerary'],
                routeData: action.payload['newRoute']
            }
        }
        default: return state
    }
}

const [state, dispatch] = useReducer(reducer, initialState)

const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch])

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}