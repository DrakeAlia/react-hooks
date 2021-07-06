// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

import {
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
  fetchPokemon,
} from '../pokemon'

// We created an error boundary, which we wrapped our Pokémon info component in.
class ErrorBoundary extends React.Component {
  // but if there is an error in there, then react will look for the closest error boundary or 
  // the closest component that implements the static method and it will pass us the error
  state = {error: null}
  static getDerivedStateFromError(error) {
    return {error}
  }
  // it will trigger a re-render of this error boundary, and because that error now exists in state, 
  // we will render whatever fallback component the user of our error boundary provided, 
  // so we can display a nice useful error message to our users.
  render() {
    const {error} = this.state
    if (error) {
      return <this.props.FallbackComponent error={error} />
    }
    console.log('ErrorBoundary', this.state.error)
    // The error boundary, by default, will just render all the children, 
    // so it's just a regular wrapper, it doesn't really do anything,
    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })

  const {status, pokemon, error} = state
  console.log(state)

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({status: 'resolved', pokemon})
      },
      error => {
        setState({status: 'rejected', error})
      },
    )
  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    // what we're doing here is we wanted to manage not only errors that we get from our fetch requests, 
    // but also errors that we get in runtime from our JavaScript
    // this will be handle by our error boundary
   throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }
  throw new Error('This shoud be impossible')
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
