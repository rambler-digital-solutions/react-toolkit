import React from 'react'
import type {PageComponent} from '../../client'

const GetAsyncData: PageComponent = () => {
  return <h1>Get async data</h1>
}

GetAsyncData.getMetaData = async () => {
  return {title: 'Get async data'}
}

GetAsyncData.getInitialData = async () => {
  return {message: 'Hello'}
}

export default GetAsyncData
