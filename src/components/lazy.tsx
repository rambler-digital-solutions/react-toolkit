import React, {lazy as reactLazy} from 'react'
import type {
  Context,
  PageComponent,
  LazyPageComponent,
  Loader,
  MetaData,
  InitialData
} from '../common/types'

/** Page component factory */
export interface ComponentModule {
  default: PageComponent
}

/** Page component factory */
export interface ComponentFactory {
  (): Promise<ComponentModule>
}

/** Data factory */
export interface DataFactory<T, C = any> {
  (component: PageComponent, context: Context & C): ReturnType<Loader<T, C>>
}

/**
 * Lazy component wrapper
 *
 * You should use this instead of React.lazy
 * to supports initial and meta data methods in components
 *
 * ```ts
 * import {lazy} from '@rambler-tech/react-toolkit/client'
 *
 * const MainPage = lazy(() => import('./pages/main'))
 * const AboutPage = lazy(() => import('./pages/about'))
 * ```
 */
export const lazy = (componentFactory: ComponentFactory): LazyPageComponent => {
  let componentModule: ComponentModule
  let componentPromise: ReturnType<ComponentFactory>

  const onceFactory: ComponentFactory = async () => {
    if (!componentModule) {
      componentPromise ??= componentFactory()
      componentModule = await componentPromise
    }

    return componentModule
  }

  function loaderFactory<T, C = any>(
    dataFactory?: DataFactory<T, C>
  ): Loader<T, C> {
    return async (context: Context & C) => {
      const {default: Component} = await onceFactory()

      return dataFactory?.(Component, context)
    }
  }

  const ReactLazy = reactLazy(onceFactory)

  const Lazy: LazyPageComponent = (props) => {
    const Component = componentModule?.default ?? ReactLazy

    return <Component {...props} />
  }

  Lazy.getMetaData = loaderFactory<MetaData, {data: InitialData}>(
    ({getMetaData}, context) => getMetaData?.(context)
  )

  Lazy.getInitialData = loaderFactory<InitialData>(
    ({getInitialData}, context) => getInitialData?.(context)
  )

  Lazy.preload = loaderFactory<void>()

  return Lazy
}
