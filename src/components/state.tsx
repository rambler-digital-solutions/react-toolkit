import React from 'react'
import serialize from 'serialize-javascript'
import {useAppContext} from './context'

const STATE_NAME = 'SERVER_APP_STATE'

/** State injector props */
export interface StateProps {
  /** Key to passing state from server to client */
  name?: string
  /** State value */
  state?: any
}

/**
 * State injector component
 *
 * ```tsx
 * import React, {FC, ReactNode} from 'react'
 * import {Provider} from 'react-redux'
 * import {useAppContext, State} from '@rambler-tech/react-toolkit/client'
 *
 * export interface MyLayoutProps {
 *   children: ReactNode
 * }
 *
 * export const MyLayout: FC<MyLayoutProps> = ({children}) => {
 *   const {store} = useAppContext()
 *
 *   return (
 *     <>
 *       <Provider store={store}>{children}</Provider>
 *       <State name="INITIAL_STATE" state={store.getState()} />
 *     </>
 *   )
 * }
 * ```
 */
export const State: React.FC<StateProps> = ({name = STATE_NAME, state}) => {
  const {data, meta, styles, scripts} = useAppContext()
  const appState = state ?? {data, meta, styles, scripts}

  return (
    <script
      defer
      dangerouslySetInnerHTML={{
        __html: `window.__${name.toUpperCase()}__ =  ${serialize(appState)}`
      }}
    />
  )
}

/**
 * Get injected state
 *
 * ```ts
 * import {getState, hydrateFromStream} from '@rambler-tech/react-toolkit/client'
 * import {routes} from './routes'
 * import {MyLayout} from './layout'
 * import {createStore} from './store'
 *
 * const initialState = getState('INITIAL_STATE')
 * const store = createStore(initialState)
 *
 * hydrateFromStream({
 *   routes,
 *   Layout: MyLayout,
 *   store
 * })
 * ```
 */
export const getState = <T extends Record<string, any>>(
  name = STATE_NAME,
  remove = true
): T => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const state = window[`__${name.toUpperCase()}__`]

  if (remove) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete window[`__${name.toUpperCase()}__`]
  }

  return state
}
