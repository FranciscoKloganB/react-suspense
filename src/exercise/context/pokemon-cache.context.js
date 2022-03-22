import * as React from 'react'
import {createResource} from '../../utils'
import {  fetchPokemon } from '../../pokemon'

const PokemonResourceCacheContext = React.createContext()

function createPokemonResource(pokemonName) {
  return createResource(fetchPokemon(pokemonName))
}

export function usePokemonResourceCache() {
  return React.useContext(PokemonResourceCacheContext)
}

export function PokemonResourceCacheProvider({children}) {
  // By using React.useRef({}) we avoid creating a new object every render
  // We want to keep the object consistent through renders - same reference!
  const cache = React.useRef({})

  // We want to make getPokemonResourceFromCache stable, so we memoize it on useCallback
  const getPokemonResourceFromCache = React.useCallback(pokemonName => {
    let pokemonNameLowered = pokemonName.toLowerCase()
    let pokemonResource = cache.current[pokemonNameLowered]

    if (pokemonResource) {
      return pokemonResource
    }

    pokemonResource = createPokemonResource(pokemonNameLowered)
    cache.current[pokemonNameLowered] = pokemonResource

    return pokemonResource
  }, [])

  return (
    <PokemonResourceCacheContext.Provider value={getPokemonResourceFromCache}>
      {children}
    </PokemonResourceCacheContext.Provider>
  )
}
