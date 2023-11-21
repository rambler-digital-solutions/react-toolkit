# React Toolkit

Toolkit for server-side rendered route based apps built with React and React Router

## Install

```sh
npm install @rambler-tech/react-toolkit
```

or 

```sh
yarn add @rambler-tech/react-toolkit
```

## Usage

### Base example

```ts
// src/routes.ts
import {lazy} from '@rambler-tech/react-toolkit/client'

const MainPage = lazy(() => import('./pages/main'))
const AboutPage = lazy(() => import('./pages/about'))

export const routes = [
  {
    path: '/',
    Component: MainPage
  },
  {
    path: '/about',
    Component: AboutPage
  }
]
```

```ts
// src/server.ts
import express from 'express'
import {renderToStream} from '@rambler-tech/react-toolkit/server'
import {routes} from './routes'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const server = express()

server
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    try {
      const {css: styles, js: scripts} = assets.client

      await renderToStream({
        req,
        res,
        routes,
        styles,
        scripts
      })
    } catch (error) {
      console.error(error)
    }
  })

export default server
```

```ts
// src/client.ts
import {hydrateFromStream} from '@rambler-tech/react-toolkit/client'
import {routes} from './routes'

hydrateFromStream({routes})
```

### Data fetching

```tsx
import React from 'react'
import {PageComponent} from '@rambler-tech/react-toolkit/client'
import {api} from './api'

export interface MainPageProps {
  someProp: any
}

const MainPage: PageComponent<MainPageProps> = ({someProp}) => (
  <div>
    <h1>Main page</h1>
    <p>{someProp}</p>
  </div>
)

MainPage.getInitialData = async () => {
  const {someProp} = await api.getSomeProp()

  return {someProp}
}

export default MainPage
```

### Pages meta data

```tsx
import React from 'react'
import {PageComponent} from '@rambler-tech/react-toolkit/client'

const MainPage: PageComponent = () => (
  <div>
    <h1>Main page</h1>
    <p>...</p>
  </div>
)

MainPage.getMetaData = () => ({
  title: 'Main page',
  description: '...'
})

export default MainPage
```

Getting the meta data is called after the data fetching, so the fetched data enriches the context passed to the `getMetaData`

```tsx
import React from 'react'
import {PageComponent} from '@rambler-tech/react-toolkit/client'

const MainPage: PageComponent = () => (
  <div>
    <h1>Main page</h1>
    <p>...</p>
  </div>
)

MainPage.getInitialData = async () => {
  const {someProp} = await api.getSomeProp()

  return {someProp}
}

MainPage.getMetaData = ({data}) => ({
  title: `Main page: ${data.someProp}`,
  description: '...'
})

export default MainPage
```

### Redirects

```tsx
import React from 'react'
import {PageComponent} from '@rambler-tech/react-toolkit/client'
import {api} from './api'

export interface MainPageProps {
  someProp: any
}

const MainPage: PageComponent<MainPageProps> = ({someProp}) => (
  <div>
    <h1>Main page</h1>
    <p>{someProp}</p>
  </div>
)

MainPage.getInitialData = async () => {
  const user = await api.getCurrentUser()

  if (!user) {
    return {
      redirect: '/login'
    }
  }
}

export default MainPage
```

### Custom Layout

For adding your own providers, markup and styles on top of pages and routing

```tsx
// src/layout.tsx
import React, {FC, ReactNode} from 'react'
import {ThemeProvider} from 'awesome-ui'
import styles from './styles.module.css'

export interface MyLayoutProps {
  children: ReactNode
}

export const MyLayout: FC<MyLayoutProps> = ({children}) => {
  return (
    <ThemeProvider>
      <main className={styles.main}>{children}</main>
    </ThemeProvider>
  )
}
```

```ts
// src/server.ts
import express from 'express'
import {renderToStream} from '@rambler-tech/react-toolkit/server'
import {routes} from './routes'
import {MyLayout} from './layout'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const server = express()

server
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    try {
      const {css: styles, js: scripts} = assets.client

      await renderToStream({
        req,
        res,
        routes,
        styles,
        scripts,
        Layout: MyLayout
      })
    } catch (error) {
      console.error(error)
    }
  })

export default server
```

```ts
// src/client.ts
import {hydrateFromStream} from '@rambler-tech/react-toolkit/client'
import {routes} from './routes'
import {MyLayout} from './layout'

hydrateFromStream({
  routes,
  Layout: MyLayout
})
```

### Custom Document

For adding custom styles, scripts, meta tags and for more flexible customization of the entire document

```tsx
// src/document.tsx
import React, {FC, ReactNode} from 'react'
import {Meta, Preloads, Styles, Scripts, State} from '@rambler-tech/react-toolkit/client'

export interface MyDocumentProps {
  children: ReactNode
}

export const MyDocument: FC<MyDocumentProps> = ({children}) => (
  <html lang="ru">
    <head>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <link rel="manifest" href="/manifest.json" />
      <Preloads />
      <link
        rel="preconnect"
        href="https://mc.yandex.ru"
        crossOrigin="anonymous"
      />
      <Styles />
    </head>
    <body>
      {children}
      <State />
      <Scripts />
      <script src="https://vp.rambler.ru/player/sdk.js" async />
    </body>
  </html>
)
```

```ts
// src/server.ts
import express from 'express'
import {renderToStream} from '@rambler-tech/react-toolkit/server'
import {routes} from './routes'
import {MyDocument} from './document'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const server = express()

server
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    try {
      const {css: styles, js: scripts} = assets.client

      await renderToStream({
        req,
        res,
        routes,
        styles,
        scripts,
        Document: MyDocument
      })
    } catch (error) {
      console.error(error)
    }
  })

export default server
```

```ts
// src/client.ts
import {hydrateFromStream} from '@rambler-tech/react-toolkit/client'
import {routes} from './routes'
import {MyDocument} from './document'

hydrateFromStream({
  routes,
  Document: MyDocument
})
```

### Page transition mode

By default, router uses `blocked` transition mode, and will wait for `getInitialData` to get completed to show the next page.

If your want show the next page with spinner or skeleton while `getInitialData` is pending, use `instant` transition mode.

```ts
// src/routes.ts
import {lazy} from '@rambler-tech/react-toolkit/client'
import {Placeholder} from './components/placeholder'

const MainPage = lazy(() => import('./pages/main'))
const AboutPage = lazy(() => import('./pages/about'))

export const routes = [
  {
    path: '/',
    Placeholder,
    Component: MainPage
  },
  {
    path: '/about',
    Placeholder,
    Component: AboutPage
  }
]
```

```ts
// src/client.ts
import {hydrateFromStream, TransitionMode} from '@rambler-tech/react-toolkit/client'
import {routes} from './routes'

hydrateFromStream({
  routes,
  transition: TransitionMode.INSTANT
})
```

### Redux example

```ts
// src/server.ts
import express from 'express'
import {renderToStream} from '@rambler-tech/react-toolkit/server'
import {routes} from './routes'
import {MyLayout} from './layout'
import {createStore} from './store'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const server = express()

server
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    try {
      const {css: styles, js: scripts} = assets.client

      const store = createStore()

      await renderToStream({
        req,
        res,
        routes,
        styles,
        scripts,
        Layout: MyLayout,
        store
      })
    } catch (error) {
      console.error(error)
    }
  })

export default server
```

```ts
// src/client.ts
import {getState, hydrateFromStream} from '@rambler-tech/react-toolkit/client'
import {routes} from './routes'
import {MyLayout} from './layout'
import {createStore} from './store'

const initialState = getState('INITIAL_STATE')
const store = createStore(initialState)

hydrateFromStream({
  routes,
  Layout: MyLayout,
  store
})
```

```tsx
// src/layout.tsx
import React, {FC, ReactNode} from 'react'
import {Provider} from 'react-redux'
import {State} from '@rambler-tech/react-toolkit/client'
import {Store} from './store'

export interface MyLayoutProps {
  children: ReactNode
  store: Store
}

export const MyLayout: FC<MyLayoutProps> = ({store, children}) => {
  return (
    <>
      <Provider store={store}>{children}</Provider>
      <State name="INITIAL_STATE" state={store.getState()} />
    </>
  )
}
```

```tsx
// src/pages/main.tsx
import React from 'react'
import {PageComponent} from '@rambler-tech/react-toolkit/client'
import {fetchInitialData} from './actions'

const MainPage: PageComponent = () => (
  <div>
    <h1>Main page</h1>
    <p>...</p>
  </div>
)

MainPage.getInitialData = async ({store}) => {
  await store.dispatch(fetchInitialData())
}

export default MainPage
```

## License

MIT
