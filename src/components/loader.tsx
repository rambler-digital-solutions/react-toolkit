import {matchRoutes, type RouteMatch} from 'react-router-dom'
import {Context, PageRoute, InitialData, MetaData} from '../common/types'

/** Match route options */
export interface MatchRouteOptions {
  pathname: string
  routes: PageRoute[]
}

/** Match route */
export const matchRoute = ({
  pathname,
  routes
}: MatchRouteOptions): RouteMatch<string, any> => {
  const [match] = matchRoutes<any>(routes, pathname) ?? []

  return match
}

/** Route loader options */
export interface LoadRouteDataOptions extends MatchRouteOptions {
  context: Context
}

/** Route data */
export interface RouteData {
  data?: InitialData
  meta?: MetaData
  match?: RouteMatch
}

/** Route loader */
export const loadRouteData = async ({
  pathname,
  routes,
  context
}: LoadRouteDataOptions): Promise<RouteData> => {
  const match = matchRoute({pathname, routes})

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

  const data = await Component.getInitialData?.({...context, match})
  const meta = await Component.getMetaData?.({...context, data, match})

  return {data, meta, match}
}
