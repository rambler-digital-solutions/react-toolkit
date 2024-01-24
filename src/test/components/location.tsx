import React from 'react'
import type {PageComponent} from '../../client'

const Location: PageComponent = () => <h1>Location</h1>

Location.getMetaData = ({data}) =>
  Promise.resolve({
    title: `Location: ${data.pathname}`
  })

Location.getInitialData = ({location}) =>
  Promise.resolve({
    pathname: location.pathname,
    search: location.search
  })

export default Location
