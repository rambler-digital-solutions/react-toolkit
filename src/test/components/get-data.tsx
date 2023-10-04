import React from 'react'
import type {PageComponent} from '../../client'

const GetData: PageComponent = () => <h1>Get data</h1>

GetData.getMetaData = () => ({
  title: 'Get data'
})

GetData.getInitialData = () => ({
  message: 'Hello'
})

export default GetData
