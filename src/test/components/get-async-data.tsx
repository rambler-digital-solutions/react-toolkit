import React from 'react'
import type {PageComponent} from '../../client'

const GetAsyncData: PageComponent = () => <h1>Get async data</h1>

GetAsyncData.getMetaData = async () => ({
  title: 'Get async data'
})

GetAsyncData.getInitialData = async () => ({
  message: 'Hello'
})

export default GetAsyncData
