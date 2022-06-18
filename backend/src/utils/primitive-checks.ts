export type AnyFunction = (...args: any[]) => any
export type PlainObject = Record<string | number | symbol, any>

type TypeGuard<A, B extends A> = (payload: A) => payload is B

export function isShortStringThan(payload: any, length: number): payload is string {
  return isString(payload) && payload.length < length
}

export function isEmptyObject(payload: any): payload is { [K in any]: never } {
  return isPlainObject(payload) && Object.keys(payload).length === 0
}

export function isFile(payload: any): payload is any {
  return getType(payload) === 'File'
}

export function isLongStringThan(payload: any, length: number): payload is string {
  return isString(payload) && payload.length > length
}

export function isShortArrayLengthThan(payload: any, length: number): payload is string {
  return isArray(payload) && payload.length < length
}

export function isLongArrayLengthThan(payload: any, length: number): payload is string {
  return isArray(payload) && payload.length > length
}

export function getType(payload: any): string {
  return Object.prototype.toString.call(payload).slice(8, -1)
}

export function isUndefined(payload: any): payload is undefined {
  return getType(payload) === 'Undefined'
}

export function isNull(payload: any): payload is null {
  return getType(payload) === 'Null'
}

export function isPlainObject(payload: any): payload is PlainObject {
  if (getType(payload) !== 'Object') return false
  return payload.constructor === Object && Object.getPrototypeOf(payload) === Object.prototype
}

export function isObject(payload: any): payload is PlainObject {
  return isPlainObject(payload)
}

export function isFunction(payload: any): payload is AnyFunction {
  return typeof payload === 'function'
}

export function isArray(payload: any): payload is any[] {
  return getType(payload) === 'Array'
}

export function isFullArray(payload: any): payload is any[] {
  return isArray(payload) && payload.length > 0
}

export function isEmptyArray(payload: any): payload is [] {
  return isArray(payload) && payload.length === 0
}

export function isString(payload: any): payload is string {
  return getType(payload) === 'String'
}

export function isFullString(payload: any): payload is string {
  return isString(payload) && payload !== ''
}

export function isEmptyString(payload: any): payload is string {
  return payload === ''
}

export function isNumber(payload: any): payload is number {
  return getType(payload) === 'Number' && !isNaN(payload)
}

export const isNullOrUndefined = isOneOf(isNull, isUndefined)

export function isOneOf<A, B extends A, C extends A>(
  a: TypeGuard<A, B>,
  b: TypeGuard<A, C>
): TypeGuard<A, B | C>
export function isOneOf(
  a: AnyFunction,
  b: AnyFunction,
  c?: AnyFunction,
  d?: AnyFunction,
  e?: AnyFunction
): (value: unknown) => boolean {
  return (value) =>
    a(value) || b(value) || (!!c && c(value)) || (!!d && d(value)) || (!!e && e(value))
}
