import React from 'react'
import {useAppContext} from './context'

export const Meta: React.FC = () => {
  const {meta = {}} = useAppContext()

  return (
    <>
      {Object.entries(meta).map(([name, content]) =>
        name === 'title' ? (
          <title key={name}>{content}</title>
        ) : name.startsWith('og:') ? (
          <meta key={name} property={name} content={content} />
        ) : (
          <meta key={name} name={name} content={content} />
        )
      )}
    </>
  )
}
