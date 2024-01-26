import React, {createContext, useContext, useState, useMemo} from 'react'
import type {Request, Response} from 'express'
import type {InitialData, MetaData} from '../common/types'

/** App context interface */
interface AppContextValue extends Record<string, any> {
  /** Express.js [request](https://expressjs.com/en/4x/api.html#req) object (server-only) */
  req?: Request
  /** Express [response](https://expressjs.com/en/4x/api.html#res) object (server-only) */
  res?: Response
  /** Initial data */
  data?: InitialData
  /** Meta data */
  meta?: MetaData
  /** Style assets list */
  styles?: string[]
  /** Script assets list */
  scripts?: string[]
  /** Change meta data callback @internal */
  onChangeMetaData: (meta: MetaData) => void
}

const AppContext = createContext({} as AppContextValue)

interface AppContextProviderProps {
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

/**
 * App context hook
 */
export const useAppContext = (): AppContextValue => useContext(AppContext)
