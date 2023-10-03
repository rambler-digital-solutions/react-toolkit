import {
  matchRoutes,
  type RouteProps,
  type NavigateFunction
} from 'react-router-dom'
import type {Location} from 'history'
import type {Request, Response} from 'express'

export interface Context extends Record<string, any> {
  req?: Request
  res?: Response
  location?: Location
  navigate?: NavigateFunction
}

export interface InitialData extends Record<string, any> {
  redirect?: string
  statusCode?: number
}

export type GetInitialData = (
  context: Context
) => InitialData | void | Promise<InitialData | void>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MetaData extends Record<string, any> {}

export type GetMetaData = (
  context: Context
) => MetaData | void | Promise<MetaData | void>

export type PageComponent<P = any> = React.ComponentType<P> & {
  getMetaData?: GetMetaData
  getInitialData?: GetInitialData
}

export interface LazyPageComponent extends React.LazyExoticComponent<any> {
  getMetaData: GetMetaData
  getInitialData: GetInitialData
}

export type PageRoute = RouteProps & {
  Component: PageComponent | LazyPageComponent
}

export interface LoadRouteDataOptions {
  context: Context
  pathname: string
  routes: PageRoute[]
}

export interface RouteData {
  data?: InitialData
  meta?: MetaData
}

export const loadRouteData = async ({
  pathname,
  routes,
  context
}: LoadRouteDataOptions): Promise<RouteData> => {
  const [match] = matchRoutes<any>(routes, pathname) ?? []

  if (!match) {
    return {
      data: {
        statusCode: 404
      }
    }
  }

  const {
    route: {Component}
  } = match
  const promises = []

  promises.push(
    Component.getInitialData?.(context) ?? Promise.resolve(),
    Component.getMetaData?.(context) ?? Promise.resolve()
  )

  const [data, meta] = await Promise.all(promises)

  return {data, meta}
}
