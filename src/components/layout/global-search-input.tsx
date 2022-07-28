import * as React from 'react'
import { forwardRef, useMergeRefs } from '@chakra-ui/react'

import { SearchInput } from './search-input'

export const GlobalSearchInput = forwardRef((props, ref) => {
  const searchRef = React.useRef<HTMLInputElement>(null)

  return (
    <SearchInput
      ref={useMergeRefs(ref, searchRef)}
      size="sm"
      sx={{
        borderColor: 'sidebar-border-color',
        _hover: {
          borderColor: 'sidebar-on',
        },
        '::placeholder': {
          color: 'sidebar-muted',
        },
      }}
    />
  )
})
