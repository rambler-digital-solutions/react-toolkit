import React from 'react'
import {useAppContext} from './context'

/** Default meta data component */
export const Meta: React.FC = () => {
  const {meta = {}} = useAppContext()

  return (
    <>
      {Object.entries(meta).map(([name, content = '']) =>
        name === 'title' ? (
          <title key={name}>{content}</title>
        ) : name.startsWith('og:') ? (
          <meta key={name} property={name} content={content} />
        ) : HEAD_LINKS_RELS.includes(name) ? (
          <link key={`${name}${content}`} rel={name} href={content} />
        ) : (
          <meta key={name} name={name} content={content} />
        )
      )}
    </>
  )
}

const HEAD_LINKS_RELS = [
  'canonical',
  'alternate',
  'icon',
  'license',
  'manifest',
  'dns-prefetch',
  'prefetch',
  'preconnect',
  'preload',
  'stylesheet'
]
