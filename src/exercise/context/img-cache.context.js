import * as React from 'react'
import {createResource} from '../../utils'

const ImageResourceCacheContext = React.createContext()

function preloadImage(src) {
  return new Promise(resolve => {
    const img = document.createElement('img')
    img.src = src
    img.onload = () => resolve(src)
  })
}

function createImageResource(src) {
  return createResource(preloadImage(src))
}

export function useImageResourceCache() {
  return React.useContext(ImageResourceCacheContext)
}

export function ImageResourceCacheProvider({children}) {
  const cache = React.useRef({})

  const getImageResourceFromCache = React.useCallback(imageSource => {
    let imageResource = cache.current[imageSource]

    if (!imageResource) {
      imageResource = createImageResource(imageSource)
      cache.current[imageSource] = imageResource
    }

    return imageResource
  }, [])

  return (
    <ImageResourceCacheContext.Provider value={getImageResourceFromCache}>
      {children}
    </ImageResourceCacheContext.Provider>
  )
}
