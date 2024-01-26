import React from 'react'
import type {PageComponent} from '../../client'

const StaticImport: PageComponent = () => <h1>Static import</h1>

StaticImport.getMetaData = ({data}) =>
  Promise.resolve({
    title: `Static import: ${data.message}`
  })

StaticImport.getInitialData = () =>
  Promise.resolve({
    message: 'Hello'
  })

export default StaticImport
