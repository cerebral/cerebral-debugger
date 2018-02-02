import ColorHash from 'color-hash'

export function nameToColors (moduleName, signalName, lightness = 0.5, saturation = 0.5) {
  let colorHash = new ColorHash({saturation: saturation, lightness: lightness})
  return {
    backgroundColor: colorHash.hex(moduleName + signalName),
    color: '#fff'
  }
}

export function isObject (obj) {
  return typeof obj === 'object' && !Array.isArray(obj) && obj !== null
}

export function isArray (array) {
  return Array.isArray(array)
}

export function isBoolean (bool) {
  return typeof bool === 'boolean'
}

export function isString (string) {
  return typeof string === 'string'
}

export function isNumber (number) {
  return typeof number === 'number'
}

export function isNull (_null) {
  return _null === null
}
