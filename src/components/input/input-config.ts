'use client';

import { createContext, useContext } from 'react';

/** Group-level defaults inherited by child inputs. Set once on `<Form>` or `<InputGroup>`. */
export interface InputConfig {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  labelPosition?: 'top' | 'left' | 'inner';
  /** Set once on `<Form>`; lets Row apply field-row alignment. */
  inForm?: true;
  /**
   * Internal marker set by `<InputGroup>`: child inputs drop their own
   * border-radius (and the visual seam radius on their own borders) so the
   * attached look is produced by the group instead of per-control corners.
   */
  flushed?: boolean;
}

export const InputConfigContext = createContext<InputConfig>({});

export const InputConfigProvider = InputConfigContext.Provider;

export function useInputConfig(): InputConfig {
  return useContext(InputConfigContext);
}
