import escape from 'htmlescape'

export const serialize = <T extends Record<string, any>>(data: T): string =>
  escape(JSON.stringify(data))

export const parse = <T extends Record<string, any>>(string: string): T =>
  JSON.parse(string)
