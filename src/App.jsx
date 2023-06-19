import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [champData, setChampData] = useState([])
  console.log(champData)
  // selector: 'aram' / 'sr'
  
  useEffect( () => {
    getChamps()
  }, [])

  const champArray = champData.map(champ => {
    const champName = champ.name.toLowerCase().split("'").join('')
    const lolalytics = `https://lolalytics.com/lol/${champName}/aram/build/`
    return (
      <li>
        <a target="_blank" href={lolalytics}>{champ.name}</a>
      </li>
    )
  })

  async function getChamps() {
    const champQuery = await fetch('https://ddragon.leagueoflegends.com/cdn/13.12.1/data/en_US/champion.json')
    const champJson = await champQuery.json()
    let champList = Object.entries(champJson.data)
    champList = champList.map(champ => champ[1])
    // console.log(champList)
    setChampData(champList)
  }

  return (
    <>
      <ul className="">
        {champArray}
      </ul>
    </>
  )
}

export default App
