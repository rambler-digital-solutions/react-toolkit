import React from 'react'
import type {PageComponent} from '../../client'

const HomePage: PageComponent = () => <h1>Home</h1>

HomePage.getMetaData = ({data}) =>
  Promise.resolve({
    title: `Home: ${data.message}`
  })

HomePage.getInitialData = () =>
  Promise.resolve({
    message: 'Hello'
  })

export default HomePage
