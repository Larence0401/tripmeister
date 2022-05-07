import tw from "tailwind-styled-components"
import {useAppContext} from '../store/appContext'

const ToggleIcon = () => {

    const {state,dispatch} = useAppContext()
    const isVisible = state.sidebarIsOpen ? "opacity-0" : null
    const isSkewed = state.sidebarIsOpen ? "rotate-[135deg] mt-[8px]" : null
    const isSkewed2 = state.sidebarIsOpen ? "-rotate-[135deg] -mt-[9px]" : null
    
  
  return (
    <div className="relative">
        <Hamburger onClick={() => dispatch({type: 'openSidebar'})}>
            <HorizontalBar className={`transition-all duration-300 box-border relative float-left ${isSkewed}`}/>
            <HorizontalBar className={`transition-all duration-300 box-border relative float-left mt-[3px] ${isVisible}`}/>
            <HorizontalBar className={`transition-all duration-300 box-border relative float-left mt-[3px] ${isSkewed2}`}/>
        </Hamburger>
    </div>
  )
}

export default ToggleIcon

const Hamburger = tw.div`
    transition-all
    duration-300
    box-border
    relative
    z-90
    h-full
    w-full
    top-[22px]
    left-[15px]
    h-[22px]
    w-[22px]
`
const HorizontalBar = tw.div`
    transition-all
    duration-300
    box-border
    absolute
    h-[3px]
    w-full
    bg-white
`