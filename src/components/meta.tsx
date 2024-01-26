import React from 'react'
import {useAppContext} from './context'

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

/** Default meta data component */
export const Meta: React.FC = () => {
  const {meta = {}} = useAppContext()

  return (
    <>
      {Object.entries(meta).map(([name, content = '']) => {
        if (name === 'title') {
          return <title key={name}>{content}</title>
        }

        if (HEAD_LINKS_RELS.includes(name)) {
          return <link key={`${name}${content}`} rel={name} href={content} />
        }

        if (name.startsWith('og:')) {
          return <meta key={name} property={name} content={content} />
        }

        return <meta key={name} name={name} content={content} />
      })}
    </>
  )
}
