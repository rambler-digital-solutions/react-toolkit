import React from 'react'

/** Default layout props */
export interface LayoutProps {
  children: React.ReactNode
}

/** Default layout component */
export const Layout: React.FC<LayoutProps> = ({children}) => <>{children}</>
