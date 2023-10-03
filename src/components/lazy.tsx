import {lazy as reactLazy} from 'react'
import type {
  Context,
  PageComponent,
  LazyPageComponent,
  MetaData,
  InitialData
} from './loader'

export type ComponentFactory = () => Promise<{default: PageComponent}>

export const lazy = (factory: ComponentFactory): LazyPageComponent => {
  let promise: ReturnType<ComponentFactory>

  const onceFactory: ComponentFactory = () => {
    if (!promise) {
      promise = factory()
    }

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
