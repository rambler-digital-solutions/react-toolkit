import React from 'react'
import {renderToPipeableStream} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom/server'
import type {Location} from 'history'
import type {Request, Response} from 'express'
import {RenderOptions} from '../common/types'
import {AppContextProvider} from '../components/context'
import {loadRouteData} from '../components/loader'
import {Routes} from '../components/routes'
import {Layout as BaseLayout} from '../components/layout'
import {Document as BaseDocument} from '../components/document'

/** Render to stream options */
export interface RenderToStreamOptions extends RenderOptions {
  /** Express.js [request](https://expressjs.com/en/4x/api.html#req) object (server-only) */
  req: Request
  /** Express [response](https://expressjs.com/en/4x/api.html#res) object (server-only) */
  res: Response
  /** Style assets list (server-only) */
  styles?: string[]
  /** Script assets list (server-only) */
  scripts?: string[]
}

/**
 * Render app to stream
 *
 * ```ts
 * import express from 'express'
 * import {renderToStream} from '@rambler-tech/react-toolkit/server'
 * import {routes} from './routes'
 *
 * const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)
 *
 * const server = express()
 *
 * server
 *   .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
 *   .get('/*', async (req, res) => {
 *     try {
 *       const {css: styles, js: scripts} = assets.client
 *
 *       await renderToStream({
 *         req,
 *         res,
 *         routes,
 *         styles,
 *         scripts
 *       })
 *     } catch (error) {
 *       console.error(error)
 *     }
 *   })
 *
 * export default server
 * ```
 */
export const renderToStream = async (
  options: RenderToStreamOptions
): Promise<void> => {
  const {
    req,
    res,
    routes,
    styles,
    scripts,
    Layout = BaseLayout,
    Document = BaseDocument,
    ...rest
  } = options
  const {path: pathname, originalUrl} = req

  const index = originalUrl?.indexOf('?')
  const search = index >= 0 ? originalUrl.slice(index) : ''

  const context = {
    req,
    res,
    location: {
      pathname,
      search
    } as Location,
    ...rest
  }

  const {data, meta} = await loadRouteData({pathname, routes, context})

  if (data?.redirect) {
    return res.redirect(data?.statusCode ?? 302, data.redirect)
  }

  res.status(data?.statusCode ?? 200)

  const appContext = {
    req,
    res,
    data,
    meta,
    styles,
    scripts,
    ...rest
  }

  const app = (
    <AppContextProvider value={appContext}>
      <Document>
        <StaticRouter location={pathname}>
          <Layout {...rest}>
            <Routes routes={routes} />
          </Layout>
        </StaticRouter>
      </Document>
    </AppContextProvider>
  )

  await new Promise<void>((resolve, reject) => {
    const stream = renderToPipeableStream(app, {
      onAllReady() {
        resolve()
      },
      onShellReady() {
        stream.pipe(res)
      },
      onShellError(error) {
        reject(error)
      }
    })
  })
}
