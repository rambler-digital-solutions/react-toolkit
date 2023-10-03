import React, {createContext, useContext, useState, useMemo} from 'react'
import type {Request, Response} from 'express'
import type {InitialData, MetaData} from './loader'

export interface AppContextValue extends Record<string, any> {
  req?: Request
  res?: Response
  data?: InitialData
  meta?: MetaData
  styles?: string[]
  scripts?: string[]
  onChangeMetaData: (meta: MetaData) => void
}

export const AppContext = createContext({} as AppContextValue)

export interface AppContextProviderProps {
  value: Omit<AppContextValue, 'onChangeMetaData'>
  children: React.ReactNode
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  value,
  children
}) => {
  const [meta, setMeta] = useState<MetaData>(value.meta ?? {})

  const appContext = useMemo<AppContextValue>(
    () => ({
      ...value,
      meta,
      onChangeMetaData: setMeta
    }),
    [value, meta]
  )

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  )
}

export const useAppContext = (): AppContextValue => useContext(AppContext)
