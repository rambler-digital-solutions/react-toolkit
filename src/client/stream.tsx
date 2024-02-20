import React from 'react'
import {hydrateRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {type RenderOptions, TransitionMode} from '../common/types'
import {getState} from '../components/state'
import {AppContextProvider} from '../components/context'
import {matchRoute} from '../components/loader'
import {Routes} from '../components/routes'
import {Layout as BaseLayout} from '../components/layout'
import {Document as BaseDocument} from '../components/document'

/** Hydrate from stream options */
export interface HydrateFromStreamOptions extends RenderOptions {
  /**
   * Whether to scroll to top on page transitions, defaults to true
   */
  scrollToTop?: boolean
  /**
   * Page transition mode, defaults to blocked
   */
  transition?: TransitionMode
}

/**
 * Render app to stream
 *
 * ```ts
 * import {hydrateFromStream} from '@rambler-tech/react-toolkit/client'
 * import {routes} from './routes'
 *
 * hydrateFromStream({routes})
 * ```
 */
export const hydrateFromStream = async (
  options: HydrateFromStreamOptions
): Promise<void> => {
  const {pathname, ...state} = getState()

  const {
    routes,
    Layout = BaseLayout,
    Document = BaseDocument,
    scrollToTop = true,
    transition = TransitionMode.BLOCKED,
    ...rest
  } = options

  const appContext = {
    ...state,
    ...rest
  }

  const app = (
    <AppContextProvider value={appContext}>
      <Document>
        <BrowserRouter>
          <Routes
            routes={routes}
            scrollToTop={scrollToTop}
            transition={transition}
            Layout={Layout}
          />
        </BrowserRouter>
      </Document>
    </AppContextProvider>
  )

  const match = matchRoute({pathname, routes})

  if (match) {
    const {
      route: {Component}
    } = match

    await Component.preload?.()
  }

  hydrateRoot(document, app)
}
