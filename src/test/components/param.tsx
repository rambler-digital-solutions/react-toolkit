import React from 'react'
import type {PageComponent} from '../../client'

const Param: PageComponent = () => <h1>Param</h1>

Param.getMetaData = async ({data}) => ({
  title: 'Param: ' + data.message
})

Param.getInitialData = async ({match}) => ({
  message: match?.params.message
})

export default Param
