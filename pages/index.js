import Head from 'next/head'
import tw from "tailwind-styled-components"
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Main from '../components/Main'
import Search from '../components/Search'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import("../components/Map"), {
  loading: () => "Loading...",
  ssr: false
})


export default function Home() {
  return (
    <Wrapper>
      <Head>
          <title>Tripmeister | travel planning app</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="description" content="tripmeister - a free travel planning app"/>
          <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.7.1/mapbox-gl.css' rel='stylesheet' />
      </Head>
      <Header/>
      <Sidebar/>
      <Main>
        <Search/>
        <MapComponent/>
      </Main>
    </Wrapper>
  )
}

const Wrapper = tw.div`
    flex
    items-center
    justify-center
    flex-col
    w-full
    h-screen
    bg-slate-50
`
