// useTransition for improved loading states
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

// 🐨 create a SUSPENSE_CONFIG variable right here and configure timeoutMs to
// whatever feels right to you, then try it out and tweak it until you're happy
// with the experience.
const DEPRECATED_SUSPENSE_CONFIG = {
  // timeoutMs is deprecated, but in this exercise it controls for how long the
  // spinner or in our case, before it lets React.Suspense take over with the fallback
  // For example, we do not want to show "loading" it loading times are really fast.
  // in this case, we just want our current pokemon to fadeout until a new one appears.
  // Consequently, the longer the timeoutMs is, the longer the current pokemon remains
  // faded. If the request does not finish when timeout ends, then, React.suspense
  // takes over and shows "Loading pokemon...", until the data is available or fails.
  timeoutMs: 2000
}

function createPokemonResource(pokemonName) {
  // shows busy indicator for a split second
  // 💯 this is what the extra credit improves
  const delay = 100
  return createResource(fetchPokemon(pokemonName, delay))
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [pokemonResource, setPokemonResource] = React.useState(null)
  // 🐨 add a useTransition hook here
  const [startTransition, isPendingTransition] = React.useTransition(
    DEPRECATED_SUSPENSE_CONFIG,
  )

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
      return
    }
    // 🐨 wrap this next line in a startTransition call
    startTransition(() =>
      setPokemonResource(createPokemonResource(pokemonName)),
    )
    // 🐨 add startTransition to the deps list here
  }, [pokemonName, startTransition])

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className={`pokemon-info ${isPendingTransition ? 'pokemon-loading' : ''}`}>
        {pokemonResource ? (
          <PokemonErrorBoundary
            onReset={handleReset}
            resetKeys={[pokemonResource]}
          >
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </React.Suspense>
          </PokemonErrorBoundary>
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App
