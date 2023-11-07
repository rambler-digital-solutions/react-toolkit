import React from 'react'
import type {PageComponent} from '../../client'

const HomePage: PageComponent = () => <h1>Home</h1>

HomePage.getMetaData = async ({data}) => ({
  title: 'Home: ' + data.message
})

HomePage.getInitialData = async () => ({
  message: 'Hello'
})

export default HomePage
