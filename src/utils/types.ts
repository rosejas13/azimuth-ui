import type { CSSProperties, ReactNode } from 'react';

export type AsProp<T extends React.ElementType> = { as?: T };

export type PropsWithAs<T extends React.ElementType, P = object> = AsProp<T> & P;

export type WithChildren<T = object> = T & { children?: ReactNode };

export type WithClassName<T = object> = T & { className?: string };

export type WithStyle<T = object> = T & { style?: CSSProperties };

export type WithId<T = object> = T & { id?: string };
