import React from 'react'
import type {PageComponent} from '../../client'

const Parameter: PageComponent = () => <h1>Param</h1>

Parameter.getMetaData = ({data}) =>
  Promise.resolve({
    title: `Param: ${data.message}`
  })

Parameter.getInitialData = ({match}) =>
  Promise.resolve({
    message: match?.params.message
  })

export default Parameter
