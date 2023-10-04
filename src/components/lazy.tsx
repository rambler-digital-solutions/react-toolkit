import {lazy as reactLazy} from 'react'
import type {
  Context,
  PageComponent,
  LazyPageComponent,
  MetaData,
  InitialData
} from '../common/types'

/** Component factory */
export type ComponentFactory = () => Promise<{default: PageComponent}>

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
export const lazy = (factory: ComponentFactory): LazyPageComponent => {
  let promise: ReturnType<ComponentFactory>

  const onceFactory: ComponentFactory = () => {
    promise ??= factory()

    return promise
  }

  const Component = reactLazy(onceFactory) as LazyPageComponent

  Component.getMetaData = async (
    context: Context
  ): Promise<MetaData | void> => {
    const {default: component} = await onceFactory()

    return component.getMetaData?.(context) ?? Promise.resolve()
  }

  Component.getInitialData = async (
    context: Context
  ): Promise<InitialData | void> => {
    const {default: component} = await onceFactory()

    return component.getInitialData?.(context) ?? Promise.resolve()
  }

  return Component
}
