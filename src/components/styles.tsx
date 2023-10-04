import React from 'react'
import {useAppContext} from './context'

/** Default styles component */
export const Styles: React.FC = () => {
  const {styles} = useAppContext()

  return (
    <>
      {styles?.map((href) => <link key={href} href={href} rel="stylesheet" />)}
    </>
  )
}
