import React from 'react'
import {hydrateRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {getState} from '../components/state'
import {AppContextProvider} from '../components/context'
import type {PageRoute} from '../components/loader'
import {Routes} from '../components/routes'
import {Layout as BaseLayout} from '../components/layout'
import {Document as BaseDocument} from '../components/document'

export interface HydrateFromStreamOptions extends Record<string, any> {
  routes: PageRoute[]
  Layout?: React.FC<any>
  Document?: React.FC<any>
}

export const hydrateFromStream = async ({
  routes,
  Layout = BaseLayout,
  Document = BaseDocument,
  ...rest
}: HydrateFromStreamOptions): Promise<void> => {
  const state = getState()

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
