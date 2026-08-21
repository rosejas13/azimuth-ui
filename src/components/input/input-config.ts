'use client';

import { createContext, useContext } from 'react';

/** Group-level defaults inherited by child inputs. Set once on `<Form>` or `<InputGroup>`. */
export interface InputConfig {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  labelPosition?: 'top' | 'left' | 'inner';
}

export const InputConfigContext = createContext<InputConfig>({});

export const InputConfigProvider = InputConfigContext.Provider;

export function useInputConfig(): InputConfig {
  return useContext(InputConfigContext);
}
