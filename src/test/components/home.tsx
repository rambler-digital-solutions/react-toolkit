import React from 'react'
import type {PageComponent} from '../../client'

const HomePage: PageComponent = () => {
  return <h1>Home</h1>
}

HomePage.getMetaData = async () => {
  return {title: 'Home'}
}

HomePage.getInitialData = async () => {
  return {message: 'Hello'}
}

export default HomePage
