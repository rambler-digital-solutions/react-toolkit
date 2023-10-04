import React from 'react'
import type {PageComponent} from '../../client'

const Param: PageComponent = () => <h1>Param</h1>

Param.getMetaData = async () => ({
  title: 'Param'
})

Param.getInitialData = async ({match}) => ({
  message: match?.params.message
})

export default Param
