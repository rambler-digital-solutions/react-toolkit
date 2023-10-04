import React from 'react'
import {hydrateRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {RenderOptions} from '../common/types'
import {getState} from '../components/state'
import {AppContextProvider} from '../components/context'
import {Routes} from '../components/routes'
import {Layout as BaseLayout} from '../components/layout'
import {Document as BaseDocument} from '../components/document'

/** Hydrate from stream options */
export interface HydrateFromStreamOptions extends RenderOptions {}

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
  const state = getState()
  const {
    routes,
    Layout = BaseLayout,
    Document = BaseDocument,
    ...rest
  } = options

  const appContext = {
    ...state,
    ...rest
  }

  const app = (
    <AppContextProvider value={appContext}>
      <Document>
        <Layout>
          <BrowserRouter>
            <Routes routes={routes} />
          </BrowserRouter>
        </Layout>
      </Document>
    </AppContextProvider>
  )

  hydrateRoot(document, app)
}
