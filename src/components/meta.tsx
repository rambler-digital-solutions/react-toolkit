import React from 'react'
import {useAppContext} from './context'

/** Default meta data component */
export const Meta: React.FC = () => {
  const {meta: {title, meta, links} = {}} = useAppContext()

  return (
    <>
      {title && <title>{title}</title>}
      {meta &&
        Object.entries(meta).map(([name, content = '']) =>
          name.startsWith('og:') ? (
            <meta key={name} property={name} content={content} />
          ) : (
            <meta key={name} name={name} content={content} />
          )
        )}
      {links &&
        Object.entries(links).map(([rel, href = '']) => (
          <link key={rel} rel={rel} href={href} />
        ))}
    </>
  )
}
