import React from 'react'
import type {PageComponent} from '../../client'

const Location: PageComponent = () => <h1>Location</h1>

Location.getMetaData = async ({data}) => ({
  title: 'Location: ' + data.pathname
})

Location.getInitialData = async ({location}) => ({
  pathname: location.pathname,
  search: location.search
})

export default Location
