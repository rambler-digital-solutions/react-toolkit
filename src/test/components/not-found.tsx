import React from 'react'
import type {PageComponent} from '../../client'

const NotFound: PageComponent = () => <h1>Not found</h1>

NotFound.getMetaData = () => ({
  title: '404'
})

NotFound.getInitialData = () => ({
  statusCode: 404
})

export default NotFound
