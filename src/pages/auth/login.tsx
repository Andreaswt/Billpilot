import * as React from 'react'
import { NextPage } from "next";
import router from 'next/router'

import { Loader, LoginView } from '@saas-ui/react'
import { useSession } from 'next-auth/react'
import { Button, ButtonGroup, Center, Container, Link, Stack, useColorMode } from '@chakra-ui/react';

const LoginPage: NextPage = () => {
  const { status } = useSession()
  const { toggleColorMode, colorMode } = useColorMode()

  if (status === "authenticated") {
    router.push("/dashboard");
  }

  // return (
  //   <Center height="100vh">
  //     <Stack spacing="8">
  //       <SaasUILogo />

  //       {status === "authenticated" ? (
  //         <ButtonGroup>
  //           <Button colorScheme="primary">
  //             Dashboard
  //           </Button>
  //           <Button onClick={() => console.log("hejej")}>Logout</Button>
  //         </ButtonGroup>
  //       ) : (
  //         <ButtonGroup>
  //           <Button>Login</Button>
  //           <Button>Sign up</Button>
  //         </ButtonGroup>
  //       )}
  //     </Stack>
  //   </Center>
  // )

  return (
    <Center height="100vh">
    <Stack flex="1" direction="row">
      <Stack
        flex="1"
        alignItems="center"
        justify="center"
        direction="column"
        spacing="8"
      >
        <Container>

          <LoginView title="Welcome back" type="password" />
        </Container>
        <Button onClick={() => toggleColorMode()}>color</Button>

        <Link href="auth/signup">Dont have an account yet? Sign up.</Link>
      </Stack>
    </Stack>
    </Center >
  )
}

export default LoginPage;