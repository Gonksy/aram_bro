import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [champData, setChampData] = useState([])
  const [filteredChamps, setFilteredChamps] = useState(champData)
  const [searchOptions, setSearchOptions] = useState(JSON.parse(localStorage.getItem('searchOptions')) || {
    site: 'lolalytics',
    mode: 'aram'
  })
  const inputRef = useRef(filteredChamps[0])
  // console.log(searchOptions)
  
  // Load champs
  useEffect( () => {
    getChamps()
  }, [])

  // Save search options on change
  useEffect( () => {
    localStorage.setItem('searchOptions', JSON.stringify(searchOptions))
  }, [searchOptions])

  const champArray = filteredChamps.map(champ => {
    const champName = prepareName(champ.name)
    const link = generateUrl(champName)
    const champImage = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champ.key}.png`
   
    return (
      <li key={champ.key}>
        <a target="_blank" href={link}>
          <img src={champImage} alt={champ.name} />
          {champ.name}
        </a>
      </li>
    )
  })

  function prepareName (champName) {
    // Replace with regex that removes apostrophes, dots, and spaces
    let name = champName.toLowerCase().split("'").join('')
    name = name.split(".").join('')
    name = name.split(" ").join('')
    return name
  }

  function generateUrl (champName) {
    const selector = searchOptions.mode + searchOptions.site
    const urls = {
      'aramlolalytics': `https://lolalytics.com/lol/${champName}/aram/build/`,
      'srlolalytics': `https://lolalytics.com/lol/${champName}/build/`,
      'arammobalytics': `https://app.mobalytics.gg/lol/champions/${champName}/aram-builds`,
      'srmobalytics': `https://app.mobalytics.gg/lol/champions/${champName}/build`
    }
    return urls[selector]
  }

  function handleChange (e) {
    const name = e.target.name
    const value = e.target.value
    setSearchOptions(prevOptions => ({...prevOptions, [name]: value}))
  }

  function filterBySearch (e) {
    const query = e.target.value

    const updatedList = [...champData].filter(champ => {
      return champ.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    })

    setFilteredChamps(updatedList)
  }
  
  function test (e) {
    e.preventDefault()
    window.open(champArray[0].props.children.props.href, '_blank')

  }

  async function getChamps() {
    if (localStorage.champList) {
      const champList = JSON.parse(localStorage.getItem('champList'))
      // console.log(champList)
      setChampData(champList)
      setFilteredChamps(champList)
      return
    }

    const champQuery = await fetch('https://ddragon.leagueoflegends.com/cdn/13.12.1/data/en_US/champion.json')
    const champJson = await champQuery.json()
    let champList = Object.entries(champJson.data)
    champList = champList.map(champ => champ[1])
    // console.log(champList)
    localStorage.setItem('champList', JSON.stringify(champList))
    setChampData(champList)
    setFilteredChamps(champList)

  }

  return (
    <>
      <form onSubmit={test} className="flex gap-1 justify-center mb-6" action="">
        <input 
          autoFocus
          className="p-4 rounded-l-full"
          type="text" 
          name="search" 
          id="search" 
          placeholder='Champion Name' 
          // value={searchOptions.search}
          onChange={filterBySearch}
        />
        <select 
          className="p-4 appearance-none hover:cursor-pointer"
          name="mode" 
          id="mode"
          value={searchOptions.mode}
          onChange={handleChange}
        >
          <option value="aram">ARAM</option>
          <option value="sr">Summoner's Rift</option>
        </select>
        <select
          className="p-4 appearance-none rounded-r-full hover:cursor-pointer"
          name="site" 
          id="site"
          value={searchOptions.site}
          onChange={handleChange}
        >
          <option value="lolalytics">Lolalytics</option>
          <option value="mobalytics">Mobalytics</option>

        </select>
      </form>
      <ul className="flex flex-wrap gap-4">
        {champArray}
      </ul>
    </>
  )
}

export default App
