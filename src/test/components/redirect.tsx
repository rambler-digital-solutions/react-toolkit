import type {PageComponent} from '../../client'

const Redirect: PageComponent = () => null

Redirect.getInitialData = () => ({
  redirect: '/'
})

export default Redirect
