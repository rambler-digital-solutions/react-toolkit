import React from 'react'
import {Meta} from './meta'
import {Preloads} from './preloads'
import {Styles} from './styles'
import {Scripts} from './scripts'
import {State} from './state'

/** Default document props */
export interface DocumentProps {
  children: React.ReactNode
}

/** Default document component */
export const Document: React.FC<DocumentProps> = ({children}) => (
  <html lang="ru">
    <head>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Preloads />
      <Styles />
    </head>
    <body>
      {children}
      <State />
      <Scripts />
    </body>
  </html>
)
