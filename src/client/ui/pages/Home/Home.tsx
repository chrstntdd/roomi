import React from 'react'

import { RadioGroup } from '@/ui/components/Playground'

import './Home.scss'

let id = 0

const initialState = [
  { id: '1', label: 'Something' },
  { id: '2', label: 'Anything else' },
  { id: '3', label: 'Short' },
  { id: '4', label: 'Super kinda really long' }
]

function Home() {
  const [selectedOption, setSelectedOption] = React.useState('A')
  const [tabs, setTabs] = React.useState(initialState)

  const updateOption = React.useCallback(event => {
    const option = event.target.parentElement.innerText

    setSelectedOption(option)
  }, [])

  const messageRef = React.useRef(null)

  return (
    <div className="home">
      Home
      <div>
        <RadioGroup
          data={tabs}
          name="test-options"
          onChange={updateOption}
          selectedItem={selectedOption}
        />
      </div>
      Selected: {selectedOption}
    </div>
  )
}

export default Home
