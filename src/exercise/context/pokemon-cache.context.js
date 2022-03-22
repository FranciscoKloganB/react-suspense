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

export function PokemonResourceCacheProvider({children, cacheTimeMs = 10000}) {
  // By using React.useRef({}) we avoid creating a new object every render
  // We want to keep the object consistent through renders - same reference!
  const cache = React.useRef({})
  const expirations = React.useRef({})

  // We want to make getPokemonResourceFromCache stable, so we memoize it on useCallback
  // This allows us to avoid re-renders when by using this function in dependency
  // array of consumers.
  const getPokemonResourceFromCache = React.useCallback(pokemonName => {
    let pokemonNameLowered = pokemonName.toLowerCase()
    let pokemonResource = cache.current[pokemonNameLowered]
    let expiresAt = expirations.current[pokemonName] || 0

    if (pokemonResource && expiresAt > Date.now()) {
      return pokemonResource
    }

    pokemonResource = createPokemonResource(pokemonNameLowered)

    cache.current[pokemonNameLowered] = pokemonResource
    expirations.current[pokemonNameLowered] = Date.now() + cacheTimeMs

    return pokemonResource
  }, [cacheTimeMs])

  return (
    <PokemonResourceCacheContext.Provider value={getPokemonResourceFromCache}>
      {children}
    </PokemonResourceCacheContext.Provider>
  )
}
