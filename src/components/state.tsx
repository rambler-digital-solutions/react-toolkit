import React from 'react'
import serialize from 'serialize-javascript'
import {useAppContext} from './context'

const STATE_NAME = 'SERVER_APP_STATE'

export interface StateProps {
  name?: string
  state?: any
}

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
