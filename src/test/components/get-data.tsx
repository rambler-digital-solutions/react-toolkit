import React from 'react'
import type {PageComponent} from '../../client'

const GetData: PageComponent = () => {
  return <h1>Get data</h1>
}

GetData.getMetaData = () => {
  return {title: 'Get data'}
}

GetData.getInitialData = () => {
  return {message: 'Hello'}
}

export default GetData
