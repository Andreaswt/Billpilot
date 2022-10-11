import React from 'react'

/**
 * Returns the path including the app base path and tenant.
 * @param path
 * @returns string The router path
 */
export const usePath = (path = '/') => {
  return React.useMemo(
    () => `/${path}`.replace(/\/\//, '/').replace(/\/$/, ''),
    [path],
  )
}
