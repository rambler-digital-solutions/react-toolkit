import React from 'react'
import type {PageComponent} from '../../client'

const HomePage: PageComponent = () => <h1>Home</h1>

HomePage.getMetaData = async () => ({
  title: 'Home'
})

HomePage.getInitialData = async () => ({
  message: 'Hello'
})

export default HomePage
