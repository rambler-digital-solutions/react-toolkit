import {matchRoutes, type RouteMatch} from 'react-router-dom'
import {Context, PageRoute, InitialData, MetaData} from '../common/types'

/** Route loader options */
export interface LoadRouteDataOptions {
  context: Context
  pathname: string
  routes: PageRoute[]
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

  const data = await Component.getInitialData?.({...context, match})
  const meta = await Component.getMetaData?.({...context, data, match})

  return {data, meta, match}
}
