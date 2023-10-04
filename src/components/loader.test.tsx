import {loadRouteData} from './loader'
import {routes} from '../test/routes'

let context: any

beforeEach(() => {
  context = {}
})

test('find page component', async () => {
  const pathname = '/'
  const matched = await loadRouteData({pathname, routes, context})
  const expected = routes.find((r) => r.path === pathname)

  expect(matched.match?.route).toEqual(expected)
})

test('get initial and meta data', async () => {
  const pathname = '/get-data'
  const matched = await loadRouteData({pathname, routes, context})

  expect(matched.match?.pathname).toBe(pathname)
  expect(matched.data).toEqual({message: 'Hello'})
  expect(matched.meta).toEqual({title: 'Get data'})
})

test('get async initial and meta data', async () => {
  const pathname = '/get-async-data'
  const matched = await loadRouteData({pathname, routes, context})

  expect(matched.match?.pathname).toBe(pathname)
  expect(matched.data).toEqual({message: 'Hello'})
  expect(matched.meta).toEqual({title: 'Get async data'})
})

test('get component with parametrized path', async () => {
  const pathname = '/param/Hello'
  const matched = await loadRouteData({pathname, routes, context})

  expect(matched.match?.pathname).toBe(pathname)
  expect(matched.data).toEqual({message: 'Hello'})
  expect(matched.meta).toEqual({title: 'Param'})
})

test('get component with static import', async () => {
  const pathname = '/static-import'
  const matched = await loadRouteData({pathname, routes, context})

  expect(matched.match?.pathname).toBe(pathname)
  expect(matched.data).toEqual({message: 'Hello'})
  expect(matched.meta).toEqual({title: 'Static import'})
})

test('get component without data', async () => {
  const pathname = '/no-get-data'
  const matched = await loadRouteData({pathname, routes, context})

  expect(matched.match?.pathname).toBe(pathname)
  expect(matched.data).toBeUndefined()
  expect(matched.meta).toBeUndefined()
})

test('get not found', async () => {
  const pathname = '/not-found'
  const matched = await loadRouteData({pathname, routes, context})

  expect(matched.match?.pathname).toBe(pathname)
  expect(matched.data).toEqual({statusCode: 404})
  expect(matched.meta).toEqual({title: '404'})
})
