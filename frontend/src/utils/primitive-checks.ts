export type AnyFunction = (...args: any[]) => any
export type AnyAsyncFunction = (...args: any[]) => Promise<any>
export type AnyClass = new (...args: any[]) => any
export type PlainObject = Record<string | number | symbol, any>

type TypeGuard<A, B extends A> = (payload: A) => payload is B

export function isShortStringThan(payload: any, length: number): payload is string {
  return isString(payload) && payload.length < length
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

export function isEmptyObject(payload: any): payload is { [K in any]: never } {
  return isPlainObject(payload) && Object.keys(payload).length === 0
}

export function isFullObject(payload: any): payload is PlainObject {
  return isPlainObject(payload) && Object.keys(payload).length > 0
}

export function isAnyObject(payload: any): payload is PlainObject {
  return getType(payload) === 'Object'
}

export function isObjectLike<T extends PlainObject>(payload: any): payload is T {
  return isAnyObject(payload)
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

export function isPositiveNumber(payload: any): payload is number {
  return isNumber(payload) && payload > 0
}

export function isNegativeNumber(payload: any): payload is number {
  return isNumber(payload) && payload < 0
}

export function isBoolean(payload: any): payload is boolean {
  return getType(payload) === 'Boolean'
}

export function isRegExp(payload: any): payload is RegExp {
  return getType(payload) === 'RegExp'
}

export function isMap(payload: any): payload is Map<any, any> {
  return getType(payload) === 'Map'
}

export function isWeakMap(payload: any): payload is WeakMap<any, any> {
  return getType(payload) === 'WeakMap'
}

export function isSet(payload: any): payload is Set<any> {
  return getType(payload) === 'Set'
}

export function isWeakSet(payload: any): payload is WeakSet<any> {
  return getType(payload) === 'WeakSet'
}

export function isSymbol(payload: any): payload is symbol {
  return getType(payload) === 'Symbol'
}

export function isDate(payload: any): payload is Date {
  return getType(payload) === 'Date' && !isNaN(payload)
}

export function isBlob(payload: any): payload is Blob {
  return getType(payload) === 'Blob'
}


export function isFile(payload: any): payload is any {
  return getType(payload) === 'File'
}

export function isPromise(payload: any): payload is Promise<any> {
  return getType(payload) === 'Promise'
}

export function isError(payload: any): payload is Error {
  return getType(payload) === 'Error'
}

export function isNaNValue(payload: any): payload is typeof NaN {
  return getType(payload) === 'Number' && isNaN(payload)
}

export function isPrimitive(
  payload: any
): payload is boolean | null | undefined | number | string | symbol {
  return (
    isBoolean(payload) ||
    isNull(payload) ||
    isUndefined(payload) ||
    isNumber(payload) ||
    isString(payload) ||
    isSymbol(payload)
  )
}

export const isNullOrUndefined = isOneOf(isNull, isUndefined)

export function isOneOf<A, B extends A, C extends A>(
  a: TypeGuard<A, B>,
  b: TypeGuard<A, C>
): TypeGuard<A, B | C>
export function isOneOf<A, B extends A, C extends A, D extends A>(
  a: TypeGuard<A, B>,
  b: TypeGuard<A, C>,
  c: TypeGuard<A, D>
): TypeGuard<A, B | C | D>
export function isOneOf<A, B extends A, C extends A, D extends A, E extends A>(
  a: TypeGuard<A, B>,
  b: TypeGuard<A, C>,
  c: TypeGuard<A, D>,
  d: TypeGuard<A, E>
): TypeGuard<A, B | C | D | E>
export function isOneOf<A, B extends A, C extends A, D extends A, E extends A, F extends A>(
  a: TypeGuard<A, B>,
  b: TypeGuard<A, C>,
  c: TypeGuard<A, D>,
  d: TypeGuard<A, E>,
  e: TypeGuard<A, F>
): TypeGuard<A, B | C | D | E | F>
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

export function isType<T extends AnyFunction | AnyClass>(payload: any, type: T): payload is T {
  if (!(type instanceof Function)) {
    throw new TypeError('Type must be a function')
  }
  if (!Object.prototype.hasOwnProperty.call(type, 'prototype')) {
    throw new TypeError('Type is not a class')
  }
  // Classes usually have names (as functions usually have names)
  const name: string | undefined | null = (type as any).name
  return getType(payload) === name || Boolean(payload && payload.constructor === type)
}
