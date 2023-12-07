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
import {loadRouteData} from './loader'

/** Routing props */
export interface RoutesProps {
  routes: PageRoute[]
  scrollToTop?: boolean
  transition?: TransitionMode
}

/** Routing component with initial and meta data */
export const Routes: React.FC<RoutesProps> = ({
  routes,
  scrollToTop,
  transition
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

  useEffect(() => {
    if (location !== currentLocation) {
      const {pathname} = location

      const context = {
        req,
        res,
        location,
        navigate,
        ...rest
      }

      setRouteData((prevState) => ({...prevState, isLoading: true}))

      if (scrollToTop && transition === TransitionMode.INSTANT) {
        window.scrollTo(0, 0)
      }

      loadRouteData({pathname, routes, context}).then((routeData) => {
        if (scrollToTop && transition !== TransitionMode.INSTANT) {
          window.scrollTo(0, 0)
        }

        setRouteData((prevState) => ({
          ...prevState,
          ...routeData,
          isLoading: false
        }))

        setCurrentLocation(location)
        onChangeMetaData?.(routeData.meta ?? {})
      })
    }
  }, [location, currentLocation, scrollToTop]) // eslint-disable-line react-hooks/exhaustive-deps

  const routerLocation =
    transition === TransitionMode.INSTANT ? location : currentLocation

  return (
    <BaseRoutes location={routerLocation}>
      {routeData.data?.redirect && <Navigate to={routeData.data.redirect} />}
      {routes.map(({path, Component, Fallback, ...routeProps}) => (
        <Route
          {...routeProps}
          key={path}
          path={path}
          element={
            <Suspense fallback={Fallback ? <Fallback /> : null}>
              {routeData.isLoading && Fallback ? (
                <Fallback />
              ) : (
                <Component {...rest} {...routeData.data} />
              )}
            </Suspense>
          }
        />
      ))}
    </BaseRoutes>
  )
}
