import * as React from 'react'
import {createResource} from '../../utils'
import {  fetchPokemon } from '../../pokemon'

const pokemonResourceCache = {}

const pokemonResourceCacheContext = React.createContext(
  getPokemonResourceFromCache,
)

function getPokemonResourceFromCache(pokemonName) {
  let pokemonResource = pokemonResourceCache[pokemonName]

  if (pokemonResource) {
    return pokemonResource
  }

  pokemonResource = createPokemonResource(pokemonName)
  pokemonResourceCache[pokemonName] = pokemonResource

  return pokemonResource
}

function createPokemonResource(pokemonName) {
  return createResource(fetchPokemon(pokemonName))
}

export function usePokemonResourceCache() {
  return React.useContext(pokemonResourceCacheContext)
}

