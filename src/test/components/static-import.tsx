import React from 'react'
import type {PageComponent} from '../../client'

const StaticImport: PageComponent = () => <h1>Static import</h1>

StaticImport.getMetaData = async ({data}) => ({
  title: 'Static import: ' + data.message
})

StaticImport.getInitialData = async () => ({
  message: 'Hello'
})

export default StaticImport
