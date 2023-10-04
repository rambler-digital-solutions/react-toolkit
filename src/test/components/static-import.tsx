import React from 'react'
import type {PageComponent} from '../../client'

const StaticImport: PageComponent = () => <h1>Static import</h1>

StaticImport.getMetaData = async () => ({
  title: 'Static import'
})

StaticImport.getInitialData = async () => ({
  message: 'Hello'
})

export default StaticImport
