// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// what makes a custom hook a custom hook isn't that the function starts with use,
// but that it uses other hooks inside of it.
// All a custom hook is is a function that uses hooks.
// Those hooks can be built-in hooks like what we're doing here, or they can be other custom hooks,
// so you can compose these things together.

// We created a function and moved that logic up in here. 
// We added some perimeters,
function useLocalStorageState(key, defaultValue = '') {
  const [state, setState] = React.useState(
    () => window.localStorage.getItem(key) || defaultValue,
  )
  // return some values, and generalized some stuff.
  React.useEffect(() => {
    window.localStorage.setItem(key, state)
  }, [key, state])

  return [state, setState]
}

// all we did here was we had some logic inside our greeting component in here. 
// We wanted to reuse that in other places of our application.
function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)
  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
