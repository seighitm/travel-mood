/// <reference types="vite/client" />


/// <reference types="vite/client" />
import 'react';
import {Key, PropsWithChildren, ReactElement, ReactNode, ValidationMap, WeakValidationMap} from 'react';

declare module 'react' {
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;

    propTypes?: WeakValidationMap<P> | undefined;
    contextTypes?: ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
  }

  export interface Attributes {
    key?: Key | null | any;
  }
}
// export type FC<P = {}> = FunctionComponent<P>;
type RenderReturnType = ReactChild | boolean | null | Array<RenderReturnType>;

interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any): RenderReturnType;

  // ...
}

// common existing types
type ReactText = string | number;
type ReactChild = ReactElement | ReactText;

interface ReactNodeArray extends Array<ReactNode> {
}

type ReactFragment = {} | ReactNodeArray;


// import 'react';
// import { PropsWithChildren, ReactElement, ReactNode, ValidationMap, WeakValidationMap } from 'react';
//
// declare module 'react' {
//   // export type FC<P = {}> = FunctionComponent<P>;
//   export interface FunctionComponent<P = {}> {
//     (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
//
//     propTypes?: WeakValidationMap<P> | undefined;
//     contextTypes?: ValidationMap<any> | undefined;
//     defaultProps?: Partial<P> | undefined;
//     displayName?: string | undefined;
//   }
// }
// // export type FC<P = {}> = FunctionComponent<P>;
// type RenderReturnType = ReactChild | boolean | null | Array<RenderReturnType>;
//
// interface FunctionComponent<P = {}> {
//   (props: PropsWithChildren<P>, context?: any): RenderReturnType;
//
//   // ...
// }
//
// // common existing types
// type ReactText = string | number;
// type ReactChild = ReactElement | ReactText;
//
// interface ReactNodeArray extends Array<ReactNode> {
// }
//
// type ReactFragment = {} | ReactNodeArray;
