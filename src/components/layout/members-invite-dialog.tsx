import * as React from 'react'

import {
  FormDialog,
  FormDialogProps,
  FormLayout,
  Field,
  Option,
} from '@saas-ui/react'

import { SubmitHandler } from 'react-hook-form'
import { trpc } from '../../utils/trpc'
import { Text } from '@chakra-ui/react'

export interface MembersInviteData {
  email: string
  role?: 'member' | string
}

interface MembersInviteInputs {
  email: string
  role?: 'member' | string
}

export interface MembersInviteDialogProps
  extends Omit<FormDialogProps<MembersInviteInputs>, 'onSubmit'> {
  roles?: Option[]
  requiredLabel?: string
  placeholder?: string
}

export const defaultMemberRoles = [
  {
    value: 'member',
    label: 'Member',
  },
]

export function MembersInviteDialog(props: MembersInviteDialogProps) {
  const {
    onClose,
    onError,
    roles,
    defaultValues,
    placeholder = 'example@company.com',
    requiredLabel = 'Add an email address.',
    ...rest
  } = props
  const [errorMessage, setErrorMessage] = React.useState<string>("")

  const inviteUsersMutation = trpc.useMutation('users.inviteUsers', {
    onSuccess() {

    }
  });

  const onInvite = async (data: MembersInviteData) => {
    const invitationResponse = await inviteUsersMutation.mutateAsync({ email: data.email })

    if (!invitationResponse?.success && invitationResponse?.message) {
      setErrorMessage(invitationResponse.message)
      throw new Error(invitationResponse.message)
    }
  }

  const fieldRef = React.useRef(null)

  const onSubmit: SubmitHandler<MembersInviteInputs> = async ({
    email,
    role,
  }) => {
    try {
      await onInvite?.({
        email: email.trim(),
        role,
      })

      onClose()
    } catch (e: any) {
      onError?.(e)
    }
  }

  const roleOptions = roles || defaultMemberRoles

  return (
    <FormDialog<MembersInviteInputs>
      {...rest}
      onClose={onClose}
      defaultValues={{
        role: 'member',
        ...defaultValues,
      }}
      initialFocusRef={fieldRef}
      onSubmit={onSubmit}
    >
      <FormLayout>
        <Field
          name="email"
          type="textarea"
          placeholder={placeholder}
          rules={{ required: requiredLabel }}
          ref={fieldRef}
        />
        <Text fontSize="sm" color="red.400">{errorMessage.length > 0 ? errorMessage : null}</Text>
        <Field label="Role" name="role" type="select" options={roleOptions} />
      </FormLayout>
    </FormDialog>
  )
}
