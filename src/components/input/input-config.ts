'use client';

import { createContext, useContext } from 'react';

/** Group-level defaults inherited by child inputs. Set once on `<Form>` or `<InputGroup>`. */
export interface InputConfig {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  labelPosition?: 'top' | 'left' | 'inner';
  /** Internal marker set by `<Form>`; lets Row apply field-row alignment. */
  inForm?: true;
}

export const InputConfigContext = createContext<InputConfig>({});

export const InputConfigProvider = InputConfigContext.Provider;

export function useInputConfig(): InputConfig {
  return useContext(InputConfigContext);
}
