import {Writable} from 'stream'
import {renderToStream} from './stream'
import {routes} from '../test/routes'
import {Layout} from '../test/components/layout'
import {Document} from '../test/components/document'

class MockResponse extends Writable {
  data = ''
  status = jest.fn()
  redirect = jest.fn()

  _write(chunk: any, _encoding: string, callback: () => void): void {
    this.data += chunk.toString()
    callback()
  }
}

let req: any
let res: any

beforeEach(() => {
  req = {}
  res = new MockResponse()
})

test('get page with status code 200', async () => {
  req.path = '/'
  await renderToStream({req, res, routes})

  expect(res.status).toBeCalledWith(200)
  expect(res.data).toContain('<title>Home</title>')
  expect(res.data).toContain('<h1>Home</h1>')
  expect(res.data).toContain(JSON.stringify({message: 'Hello'}))
})

test('get redirect with status code 302', async () => {
  req.path = '/redirect'
  await renderToStream({req, res, routes})

  expect(res.redirect).toBeCalledWith(302, '/')
  expect(res.data).toContain('')
})

test('get not found with status code 404', async () => {
  req.path = '/not-found'
  await renderToStream({req, res, routes})

  expect(res.status).toBeCalledWith(404)
  expect(res.data).toContain('<title>404</title>')
  expect(res.data).toContain('<h1>Not found</h1>')
  expect(res.data).toContain(JSON.stringify({statusCode: 404}))
})

test('get page with assets', async () => {
  const assets = {scripts: ['/app.js'], styles: ['/app.css']}

  req.path = '/'
  await renderToStream({req, res, routes, ...assets})

  expect(res.status).toBeCalledWith(200)
  expect(res.data).toContain('<link href="/app.css" rel="stylesheet"/>')
  expect(res.data).toContain('<script src="/app.js" defer=""></script>')
})

test('get page with custom layout', async () => {
  req.path = '/'
  await renderToStream({req, res, routes, Layout})

  expect(res.status).toBeCalledWith(200)
  expect(res.data).toContain('<main class="layout">')
  expect(res.data).toContain('<h1>')
})

test('get page with custom document', async () => {
  const assets = {scripts: ['/app.js'], styles: ['/app.css']}

  req.path = '/'
  await renderToStream({req, res, routes, ...assets, Document})

  expect(res.status).toBeCalledWith(200)
  expect(res.data).toContain('<title>Home</title>')
  expect(res.data).toContain('<link rel="manifest" href="/manifest.json"/>')
  expect(res.data).toContain('<link href="/app.css" rel="stylesheet"/>')
  expect(res.data).toContain('<script src="/app.js" defer=""></script>')
  expect(res.data).toContain(
    '<script src="https://cdn.test.com/script.js" async=""></script>'
  )
  expect(res.data).toContain('<h1>')
})

test('get page with custom context param', async () => {
  const store: any = {
    getState: jest.fn().mockImplementation(() => store.state),
    dispatch: jest.fn().mockImplementation((state) => {
      store.state = state
    })
  }

  req.path = '/custom-context'
  await renderToStream({req, res, routes, store})

  expect(res.status).toBeCalledWith(200)
  expect(store.dispatch).toBeCalledWith({message: 'Hello'})
  expect(store.getState).toBeCalledTimes(1)
  expect(res.data).toContain('<title>Custom context</title>')
  expect(res.data).toContain('<h1>Custom context</h1>')
  expect(res.data).toContain('__INITIAL_STATE__')
  expect(res.data).toContain(JSON.stringify({message: 'Hello'}))
})

test('get page with custom context in layout', async () => {
  const store: any = {
    getState: jest.fn().mockImplementation(() => ({message: 'Custom'}))
  }

  req.path = '/no-get-data'
  await renderToStream({req, res, routes, Layout, store})

  expect(res.status).toBeCalledWith(200)
  expect(store.getState).toBeCalledTimes(1)
  expect(res.data).toContain('<h1>No get data</h1>')
  expect(res.data).toContain('__INITIAL_STATE__')
  expect(res.data).toContain(JSON.stringify({message: 'Custom'}))
})
