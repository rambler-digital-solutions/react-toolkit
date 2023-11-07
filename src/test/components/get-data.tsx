import React from 'react'
import type {PageComponent} from '../../client'

const GetData: PageComponent = () => <h1>Get data</h1>

GetData.getMetaData = ({data}) => ({
  title: 'Get data: ' + data.message
})

GetData.getInitialData = () => ({
  message: 'Hello'
})

export default GetData
