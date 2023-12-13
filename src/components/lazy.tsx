import {lazy as reactLazy} from 'react'
import type {
  Context,
  PageComponent,
  LazyPageComponent,
  Loader,
  MetaData,
  InitialData
} from '../common/types'

/** Component factory */
export interface ComponentFactory {
  (): Promise<{default: PageComponent}>
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
  let promise: ReturnType<ComponentFactory>

  const onceFactory: ComponentFactory = () => {
    promise ??= componentFactory()

    return promise
  }

  function loaderFactory<T, C = any>(
    dataFactory?: DataFactory<T, C>
  ): Loader<T, C> {
    return async (context: Context & C) => {
      const {default: Component} = await onceFactory()

      return dataFactory?.(Component, context)
    }
  }

  const Component = reactLazy(onceFactory) as LazyPageComponent

  Component.getMetaData = loaderFactory<MetaData, {data: InitialData}>(
    ({getMetaData}, context) => getMetaData?.(context)
  )

  Component.getInitialData = loaderFactory<InitialData>(
    ({getInitialData}, context) => getInitialData?.(context)
  )

  Component.preload = loaderFactory<void>()

  return Component
}
