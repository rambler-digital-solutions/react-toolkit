import React, {Suspense, useState, useEffect} from 'react'
import {
  useLocation,
  useNavigate,
  Navigate,
  Route,
  Routes as BaseRoutes
} from 'react-router-dom'
import {type PageRoute, TransitionMode} from '../common/types'
import {useAppContext} from './context'
import {loadRouteData, matchRoute} from './loader'

/** Routing props */
interface RoutesProps {
  routes: PageRoute[]
  scrollToTop?: boolean
  transition?: TransitionMode
  Layout: React.FC<any>
}

/** Routing component with initial and meta data */
export const Routes: React.FC<RoutesProps> = ({
  routes,
  scrollToTop,
  transition,
  Layout
}) => {
  const location = useLocation()
  const navigate = useNavigate()

  const {
    req,
    res,
    data,
    meta,
    styles: _styles,
    scripts: _scripts,
    onChangeMetaData,
    ...rest
  } = useAppContext()

  const [currentLocation, setCurrentLocation] = useState(location)
  const [routeData, setRouteData] = useState({data, meta, isLoading: false})

  const isWaitingMode = transition === TransitionMode.WAIT_FOR_DATA
  const isBlockedMode = !isWaitingMode && transition !== TransitionMode.INSTANT

  useEffect(() => {
    const onNavigate = async (): Promise<void> => {
      const {pathname} = location

      const context = {
        req,
        res,
        location,
        navigate,
        ...rest
      }

      setRouteData((previousState) => ({...previousState, isLoading: true}))

      if (scrollToTop && !isBlockedMode) {
        window.scrollTo(0, 0)
      }

      const routeData = await loadRouteData({pathname, routes, context})

      if (scrollToTop && isBlockedMode) {
        window.scrollTo(0, 0)
      }

      setRouteData((previousState) => ({
        ...previousState,
        ...routeData,
        isLoading: false
      }))

      setCurrentLocation(location)
      onChangeMetaData?.(routeData.meta ?? {})
    }

    if (location !== currentLocation) {
      onNavigate()
    }
  }, [location, currentLocation, scrollToTop]) // eslint-disable-line react-hooks/exhaustive-deps

  const routerLocation = isBlockedMode ? currentLocation : location
  const match = matchRoute({pathname: routerLocation.pathname, routes})
  const Fallback = match?.route.Fallback

  return (
    <Suspense fallback={Fallback ? <Fallback /> : undefined}>
      <Layout {...rest}>
        <BaseRoutes location={routerLocation}>
          {routeData.data?.redirect && (
            <Navigate to={routeData.data.redirect} />
          )}
          {routes.map(({path, Component, Fallback, ...routeProps}) => (
            <Route
              {...routeProps}
              key={path}
              path={path}
              element={
                isWaitingMode && routeData.isLoading && Fallback ? (
                  <Fallback />
                ) : (
                  <Component
                    {...rest}
                    {...routeData.data}
                    isLoading={routeData.isLoading}
                  />
                )
              }
            />
          ))}
        </BaseRoutes>
      </Layout>
    </Suspense>
  )
}
