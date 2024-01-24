import React from 'react'
import type {PageComponent} from '../../client'

const GetAsyncData: PageComponent = () => <h1>Get async data</h1>

GetAsyncData.getMetaData = ({data}) =>
  Promise.resolve({
    title: `Get async data: ${data.message}`
  })

GetAsyncData.getInitialData = () =>
  Promise.resolve({
    message: 'Hello'
  })

export default GetAsyncData
