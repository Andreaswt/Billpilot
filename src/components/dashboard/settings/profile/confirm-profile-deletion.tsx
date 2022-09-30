import { Button } from "@chakra-ui/react"
import { useModals, useSnackbar } from "@saas-ui/react"
import { signOut } from "next-auth/react"
import { trpc } from "../../../../utils/trpc"

export const ConfirmProfileDeletion = () => {
  const modals = useModals()
  const snackbar = useSnackbar()

  const deleteAccountMutation = trpc.useMutation('account.deleteProfile', {
    onSuccess: async () => {
      await signOut({redirect: true, callbackUrl: "/"})
    },
    onError: () => {
        snackbar({
            title: 'Account could not be deleted',
            status: 'error',
            duration: 2000,
            isClosable: true,
        })
    }
});

  return (
    <Button
      colorScheme="red"
      isLoading={deleteAccountMutation.isLoading}
      onClick={() =>
        modals.confirm({
          title: 'Delete organization',
          body: 'Are you sure you want to delete your organization and account?',
          confirmProps: {
            colorScheme: 'red',
            label: 'Delete',
          },
          onConfirm: () => { deleteAccountMutation.mutate() },
        })
      }
    >
      Delete user
    </Button>
  )
}