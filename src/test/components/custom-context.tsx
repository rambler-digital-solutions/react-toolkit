import React from 'react'
import {type PageComponent, State, useAppContext} from '../../client'

const CustomContext: PageComponent = () => {
  const {store} = useAppContext()

  return (
    <>
      <h1>Custom context</h1>
      <State name="INITIAL_STATE" state={store.getState()} />
    </>
  )
}

CustomContext.getMetaData = async () => ({
  title: 'Custom context'
})

CustomContext.getInitialData = async ({store}) => {
  store.dispatch({message: 'Hello'})
}

export default CustomContext
