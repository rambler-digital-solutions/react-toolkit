import {lazy, type PageRoute} from '../client'
import StaticImport from './pages/static-import'

const HomePage = lazy(() => import('./pages/home'))
const GetData = lazy(() => import('./pages/get-data'))
const GetAsyncData = lazy(() => import('./pages/get-async-data'))
const NoGetData = lazy(() => import('./pages/no-get-data'))

export const routes: PageRoute[] = [
  {
    path: '/',
    Component: HomePage
  },
  {
    path: '/get-data',
    Component: GetData
  },
  {
    path: '/get-async-data',
    Component: GetAsyncData
  },
  {
    path: '/static-import',
    Component: StaticImport
  },
  {
    path: '/no-get-data',
    Component: NoGetData
  }
]
