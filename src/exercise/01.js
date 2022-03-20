// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
// 🐨 you'll also need to get the fetchPokemon function from ../pokemon:
// 💰 use it like this: fetchPokemon(pokemonName).then(handleSuccess, handleFailure)
import {fetchPokemon, PokemonDataView, PokemonErrorBoundary} from '../pokemon'

// 🐨 create a variable called "pokemon" (using let)
// 🐨 assign a pokemonPromise to a call to fetchPokemon('pikachu') with render-as-you-fetch approach!
// 🐨 when the promise resolves, assign the "pokemon" variable to the resolved value
let pokemon
let pokemonError
let pokemonPromise = fetchPokemon('pikachu')
  .then(data => (pokemon = data))
  .catch(error => (pokemonError = error))

function PokemonInfo() {
  // 🐨 if there's no pokemon yet, then throw the pokemonPromise
  // 💰 (no, for real. Like: `throw pokemonPromise`)
  if (pokemonError) {
    throw pokemonError
  }
  if (!pokemon) {
    throw pokemonPromise
  }

  // if the code gets it this far, then the pokemon variable is defined and rendering can continue!
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function LoadingPokemon() {
  return <div>loading pokemon...</div>
}

function App() {
  return (
    <div className="pokemon-info-app">
      <div className="pokemon-info">
        {/* 🐨 Wrap the PokemonInfo component with a React.Suspense component with a fallback */}
        <PokemonErrorBoundary>
          <React.Suspense fallback={<LoadingPokemon />}>
            <PokemonInfo />
          </React.Suspense>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
