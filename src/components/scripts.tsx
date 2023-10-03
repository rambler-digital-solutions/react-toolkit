import React from 'react'
import {useAppContext} from './context'

export const Scripts: React.FC = () => {
  const {scripts} = useAppContext()

  return <>{scripts?.map((src) => <script key={src} src={src} defer />)}</>
}
