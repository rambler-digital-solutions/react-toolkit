import React from 'react'
import type {PageComponent} from '../../client'

const StaticImport: PageComponent = () => {
  return <h1>Static import</h1>
}

StaticImport.getMetaData = async () => {
  return {title: 'Static import'}
}

StaticImport.getInitialData = async () => {
  return {message: 'Hello'}
}

export default StaticImport
