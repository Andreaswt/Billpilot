import * as React from 'react'

import { FiCircle, FiFilter, FiCalendar } from 'react-icons/fi'

import { Badge, useDisclosure } from '@chakra-ui/react'

import {
  FilterItem,
  FilterMenu,
  FilterMenuProps,
  useFiltersContext,
} from '@saas-ui/pro'
import { useHotkeysShortcut } from '@saas-ui/react'

import { startOfDay, subDays, formatDistanceToNowStrict } from 'date-fns'

const days = [1, 2, 3, 7, 14, 21, 31, 60]

export const filters: FilterItem[] = [
  {
    id: 'createdAt',
    label: 'Created at',
    icon: <FiCalendar />,
    type: 'date',
    operators: ['after', 'before'],
    defaultOperator: 'after',
    items: days
      .map((day): FilterItem => {
        const date = startOfDay(subDays(new Date(), day))
        return {
          id: `${day}days`,
          label: formatDistanceToNowStrict(date, { addSuffix: true }),
          value: date,
        }
      })
      .concat([{ id: 'custom', label: 'Custom' }]),
  },
]

export const AddFilterButton: React.FC<Omit<FilterMenuProps, 'items'>> = (
  props,
) => {
  const disclosure = useDisclosure()

  const menuRef = React.useRef<HTMLButtonElement>(null)

  const { enableFilter } = useFiltersContext()

  const onSelect = (item: FilterItem) => {
    const { id, value } = item
    enableFilter({ id, value })
  }

  return (
    <FilterMenu
      items={filters}
      icon={<FiFilter />}
      ref={menuRef}
      buttonProps={{ variant: 'outline' }}
      onSelect={onSelect}
      {...disclosure}
      {...props}
    />
  )
}
