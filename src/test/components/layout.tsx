import React from 'react'
import {State} from '../../client'

interface LayoutProps {
  store: any
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({store, children}) => (
  <>
    <main className="layout">{children}</main>
    {store && <State name="INITIAL_STATE" state={store.getState()} />}
  </>
)
