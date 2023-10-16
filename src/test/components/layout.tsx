import React, {FC, ReactNode} from 'react'
import {State} from '../../client'

export interface LayoutProps {
  store: any
  children: ReactNode
}

export const Layout: FC<LayoutProps> = ({store, children}) => (
  <>
    <main className="layout">{children}</main>
    {store && <State name="INITIAL_STATE" state={store.getState()} />}
  </>
)
