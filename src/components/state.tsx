import React from 'react'
import {isSSR} from '../common/ssr'
import {serialize, parse} from '../common/json'
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
  const {
    req: _req,
    res: _res,
    onChangeMetaData: _,
    ...context
  } = useAppContext()

  if (!isSSR) {
    return
  }

  return (
    <script
      id={`__${name.toUpperCase()}__`}
      type="application/json"
      dangerouslySetInnerHTML={{__html: serialize(state ?? context)}}
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
  name = STATE_NAME
): T => {
  const script = document.getElementById(`__${name.toUpperCase()}__`)!
  const state = parse<T>(script.textContent!)

  script.remove()

  return state
}
