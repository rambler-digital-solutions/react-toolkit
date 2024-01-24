import React from 'react'
import {useAppContext} from './context'

/** Default scripts component */
export const Scripts: React.FC = () => {
  const {scripts} = useAppContext()

  return (
    <>{scripts?.map((source) => <script key={source} src={source} defer />)}</>
  )
}
