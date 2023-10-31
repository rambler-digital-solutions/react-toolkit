import superjson from 'superjson'

export const stringify = <T extends Record<string, any>>(data: T): string =>
  escape(superjson.stringify(data))

export const parse = <T extends Record<string, any>>(string: string): T =>
  superjson.parse(string)

/**
 * NOTE:
 * Properly escape JSON for usage as an object literal inside of a `<script>` tag.
 * JS implementation of http://golang.org/pkg/encoding/json/#HTMLEscape
 * More info: http://timelessrepo.com/json-isnt-a-javascript-subset
 */

const escape = (value: string): string => value.replace(ESCAPE_REGEX, escaper)

const escaper = (match: string): string => {
  return ESCAPE_LOOKUP[match]
}

const ESCAPE_LOOKUP: Record<string, string> = {
  '&': '\\u0026',
  '>': '\\u003e',
  '<': '\\u003c',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
}

const ESCAPE_REGEX = /[&><\u2028\u2029]/g
