import React, {FC, ReactNode} from 'react'

export interface LayoutProps {
  children: ReactNode
}

export const Layout: FC<LayoutProps> = ({children}) => {
  return <main className="layout">{children}</main>
}
