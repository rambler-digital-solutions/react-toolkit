import React, {Suspense, useState, useEffect} from 'react'
import {
  useLocation,
  useNavigate,
  Navigate,
  Route,
  Routes as BaseRoutes
} from 'react-router-dom'
import {useAppContext} from './context'
import {loadRouteData, type RouteData, type PageRoute} from './loader'

export interface RoutesProps {
  routes: PageRoute[]
}

export interface RoutesState extends RouteData {
  isLoading: boolean
}

export const Routes: React.FC<RoutesProps> = ({routes}) => {
  const location = useLocation()
  const navigate = useNavigate()

  const {
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
        location,
        navigate,
        ...rest
      }

      setRouteData((prevState) => ({...prevState, isLoading: true}))

      loadRouteData({routes, pathname, context}).then((routeData) => {
        window.scrollTo(0, 0)
        setRouteData((prevState) => ({
          ...prevState,
          ...routeData,
          isLoading: false
        }))
        setCurrentLocation(location)
        onChangeMetaData?.(routeData.meta ?? {})
      })
    }
  }, [location, currentLocation]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Suspense>
      <BaseRoutes location={currentLocation}>
        {routeData.data?.redirect && <Navigate to={routeData.data.redirect} />}
        {routes.map(({path, Component}) => (
          <Route
            key={path}
            path={path}
            element={<Component {...routeData.data} />}
          />
        ))}
      </BaseRoutes>
    </Suspense>
  )
}
