"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isType = exports.isOneOf = exports.isNullOrUndefined = exports.isPrimitive = exports.isNaNValue = exports.isError = exports.isPromise = exports.isFile = exports.isBlob = exports.isDate = exports.isSymbol = exports.isWeakSet = exports.isSet = exports.isWeakMap = exports.isMap = exports.isRegExp = exports.isBoolean = exports.isNegativeNumber = exports.isPositiveNumber = exports.isNumber = exports.isEmptyString = exports.isFullString = exports.isString = exports.isEmptyArray = exports.isFullArray = exports.isArray = exports.isFunction = exports.isObjectLike = exports.isAnyObject = exports.isFullObject = exports.isEmptyObject = exports.isObject = exports.isPlainObject = exports.isNull = exports.isUndefined = exports.getType = exports.isLongArrayLengthThan = exports.isShortArrayLengthThan = exports.isLongStringThan = exports.isShortStringThan = void 0;
function isShortStringThan(payload, length) {
    return isString(payload) && payload.length < length;
}
exports.isShortStringThan = isShortStringThan;
function isLongStringThan(payload, length) {
    return isString(payload) && payload.length > length;
}
exports.isLongStringThan = isLongStringThan;
function isShortArrayLengthThan(payload, length) {
    return isArray(payload) && payload.length < length;
}
exports.isShortArrayLengthThan = isShortArrayLengthThan;
function isLongArrayLengthThan(payload, length) {
    return isArray(payload) && payload.length > length;
}
exports.isLongArrayLengthThan = isLongArrayLengthThan;
function getType(payload) {
    return Object.prototype.toString.call(payload).slice(8, -1);
}
exports.getType = getType;
function isUndefined(payload) {
    return getType(payload) === 'Undefined';
}
exports.isUndefined = isUndefined;
function isNull(payload) {
    return getType(payload) === 'Null';
}
exports.isNull = isNull;
function isPlainObject(payload) {
    if (getType(payload) !== 'Object')
        return false;
    return payload.constructor === Object && Object.getPrototypeOf(payload) === Object.prototype;
}
exports.isPlainObject = isPlainObject;
function isObject(payload) {
    return isPlainObject(payload);
}
exports.isObject = isObject;
function isEmptyObject(payload) {
    return isPlainObject(payload) && Object.keys(payload).length === 0;
}
exports.isEmptyObject = isEmptyObject;
function isFullObject(payload) {
    return isPlainObject(payload) && Object.keys(payload).length > 0;
}
exports.isFullObject = isFullObject;
function isAnyObject(payload) {
    return getType(payload) === 'Object';
}
exports.isAnyObject = isAnyObject;
function isObjectLike(payload) {
    return isAnyObject(payload);
}
exports.isObjectLike = isObjectLike;
function isFunction(payload) {
    return typeof payload === 'function';
}
exports.isFunction = isFunction;
function isArray(payload) {
    return getType(payload) === 'Array';
}
exports.isArray = isArray;
function isFullArray(payload) {
    return isArray(payload) && payload.length > 0;
}
exports.isFullArray = isFullArray;
function isEmptyArray(payload) {
    return isArray(payload) && payload.length === 0;
}
exports.isEmptyArray = isEmptyArray;
function isString(payload) {
    return getType(payload) === 'String';
}
exports.isString = isString;
function isFullString(payload) {
    return isString(payload) && payload !== '';
}
exports.isFullString = isFullString;
function isEmptyString(payload) {
    return payload === '';
}
exports.isEmptyString = isEmptyString;
function isNumber(payload) {
    return getType(payload) === 'Number' && !isNaN(payload);
}
exports.isNumber = isNumber;
function isPositiveNumber(payload) {
    return isNumber(payload) && payload > 0;
}
exports.isPositiveNumber = isPositiveNumber;
function isNegativeNumber(payload) {
    return isNumber(payload) && payload < 0;
}
exports.isNegativeNumber = isNegativeNumber;
function isBoolean(payload) {
    return getType(payload) === 'Boolean';
}
exports.isBoolean = isBoolean;
function isRegExp(payload) {
    return getType(payload) === 'RegExp';
}
exports.isRegExp = isRegExp;
function isMap(payload) {
    return getType(payload) === 'Map';
}
exports.isMap = isMap;
function isWeakMap(payload) {
    return getType(payload) === 'WeakMap';
}
exports.isWeakMap = isWeakMap;
function isSet(payload) {
    return getType(payload) === 'Set';
}
exports.isSet = isSet;
function isWeakSet(payload) {
    return getType(payload) === 'WeakSet';
}
exports.isWeakSet = isWeakSet;
function isSymbol(payload) {
    return getType(payload) === 'Symbol';
}
exports.isSymbol = isSymbol;
function isDate(payload) {
    return getType(payload) === 'Date' && !isNaN(payload);
}
exports.isDate = isDate;
function isBlob(payload) {
    return getType(payload) === 'Blob';
}
exports.isBlob = isBlob;
function isFile(payload) {
    return getType(payload) === 'File';
}
exports.isFile = isFile;
function isPromise(payload) {
    return getType(payload) === 'Promise';
}
exports.isPromise = isPromise;
function isError(payload) {
    return getType(payload) === 'Error';
}
exports.isError = isError;
function isNaNValue(payload) {
    return getType(payload) === 'Number' && isNaN(payload);
}
exports.isNaNValue = isNaNValue;
function isPrimitive(payload) {
    return (isBoolean(payload) ||
        isNull(payload) ||
        isUndefined(payload) ||
        isNumber(payload) ||
        isString(payload) ||
        isSymbol(payload));
}
exports.isPrimitive = isPrimitive;
exports.isNullOrUndefined = isOneOf(isNull, isUndefined);
function isOneOf(a, b, c, d, e) {
    return function (value) {
        return a(value) || b(value) || (!!c && c(value)) || (!!d && d(value)) || (!!e && e(value));
    };
}
exports.isOneOf = isOneOf;
function isType(payload, type) {
    if (!(type instanceof Function)) {
        throw new TypeError('Type must be a function');
    }
    if (!Object.prototype.hasOwnProperty.call(type, 'prototype')) {
        throw new TypeError('Type is not a class');
    }
    // Classes usually have names (as functions usually have names)
    var name = type.name;
    return getType(payload) === name || Boolean(payload && payload.constructor === type);
}
exports.isType = isType;
//# sourceMappingURL=primitive-checks.js.map