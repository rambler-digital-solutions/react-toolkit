import React from 'react'
import {type PageComponent, State} from '../../client'

interface CustomContextProps {
  store: any
}

const CustomContext: PageComponent<CustomContextProps> = ({store}) => (
  <>
    <h1>Custom context</h1>
    <State name="INITIAL_STATE" state={store.getState()} />
  </>
)

CustomContext.getMetaData = () =>
  Promise.resolve({
    title: 'Custom context'
  })

CustomContext.getInitialData = async ({store}) => {
  await store.dispatch({message: 'Hello'})
}

export default CustomContext
