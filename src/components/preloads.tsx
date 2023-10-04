import React from 'react'
import {useAppContext} from './context'

/** Default preload link component */
export const Preloads: React.FC = () => {
  const {styles, scripts} = useAppContext()

  return (
    <>
      {styles?.map((href) => (
        <link key={href} href={href} rel="preload" as="style" />
      ))}
      {scripts?.map((href) => (
        <link key={href} href={href} rel="preload" as="script" />
      ))}
    </>
  )
}
