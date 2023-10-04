import React from 'react'
import {renderToPipeableStream} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom/server'
import type {Request, Response} from 'express'
import {AppContextProvider} from '../components/context'
import {loadRouteData, type PageRoute} from '../components/loader'
import {Routes} from '../components/routes'
import {Layout as BaseLayout} from '../components/layout'
import {Document as BaseDocument} from '../components/document'

export interface RenderToStreamOptions extends Record<string, any> {
  req: Request
  res: Response
  routes: PageRoute[]
  styles?: string[]
  scripts?: string[]
  Layout?: React.FC<any>
  Document?: React.FC<any>
}

export const renderToStream = async ({
  req,
  res,
  routes,
  styles,
  scripts,
  Layout = BaseLayout,
  Document = BaseDocument,
  ...rest
}: RenderToStreamOptions): Promise<void> => {
  const {path: pathname} = req

  const context = {
    req,
    res,
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
        <Layout>
          <StaticRouter location={pathname}>
            <Routes routes={routes} />
          </StaticRouter>
        </Layout>
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
