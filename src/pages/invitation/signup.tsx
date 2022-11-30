import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, InputGroup,
  InputRightElement, Stack, useColorModeValue
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@saas-ui/react";
import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ISignUpInvitedUser, signUpInvitedUserFormSchema, signUpSchema } from "../../common/validation/auth";
import { BackgroundGradient } from '../../components/landing-page/gradients/background-gradient';
import { SEO } from '../../components/landing-page/seo/seo';
import { trpc } from "../../utils/trpc";

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  return {
    props: {
      id: context.query.id as string,
    }
  }
}

const Signup = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync, isLoading: isMutating } = trpc.useMutation(["users.createInvitedUser"]);
  const { data, isLoading } = trpc.useQuery(["users.getInvitation", { id: props.id }], {
    onError: () => {
      router.push("/404");
    }
  })
  const headingColor = useColorModeValue('gray.800', 'white')

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ISignUpInvitedUser>({
    resolver: zodResolver(signUpInvitedUserFormSchema),
  });

  async function onSubmit(values: ISignUpInvitedUser) {
    const result = await mutateAsync({ ...values, invitationId: props.id })

    reset();

    if (result.status === 201) {
      signOut({redirect: true, callbackUrl: "/login"})

    }
  }

  return (
    <Box>
      <SEO
        title="Sign Up"
        description="Signup for your Billpilot account"
      />
      <Box>
        <Box position="relative" overflow="hidden">
          <BackgroundGradient height="100%" />
          <Container maxW="container.xl" pt={{ base: 20, lg: 40 }} pb={{ md: 0 }}>
            <Stack flex="1" direction="row">
              <Stack
                flex="1"
                alignItems="center"
                justify="center"
                direction="column"
                spacing="8"
              >
                {
                  isLoading || !data
                    ? <Loading />
                    : <Container>
                      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                        <Heading textAlign="center" color={headingColor} fontSize="3xl" zIndex='9999'>
                          Sign up for access
                        </Heading>
                        <Heading textAlign="center" color={headingColor} fontSize="xl" zIndex='9999'>
                          You have been invited to join the organization {data.organization.name} on Billpilot.io.
                        </Heading>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <Stack spacing={4}>
                            <Box>
                              <FormControl isInvalid={!errors?.name?.message == false} id="fullName" isRequired>
                                <FormLabel>Full name</FormLabel>
                                <Input type="text" {...register("name")} />
                                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                              </FormControl>
                            </Box>
                            <FormControl>
                              <FormLabel>Email address</FormLabel>
                              <Input value={data.email} disabled={true} />
                            </FormControl>
                            <FormControl isInvalid={!errors?.password?.message == false} id="password" isRequired>
                              <FormLabel>Password</FormLabel>
                              <InputGroup>
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  {...register("password")}
                                />
                                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
                                <InputRightElement h={"full"}>
                                  <Button
                                    variant={"ghost"}
                                    _hover={{ bg: "transparent" }}
                                    _active={{ bg: "transparent" }}
                                    onClick={() =>
                                      setShowPassword(
                                        (showPassword) => !showPassword,
                                      )
                                    }
                                  >
                                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                  </Button>
                                </InputRightElement>
                              </InputGroup>
                            </FormControl>
                            <Stack spacing={10} pt={2}>
                              <Button
                                loadingText="Submitting"
                                size="lg"
                                type="submit"
                                isLoading={isMutating}
                                colorScheme="primary"
                                color={"white"}
                              >
                                Sign up
                              </Button>
                            </Stack>
                          </Stack>
                        </form>
                      </Stack>
                    </Container>
                }
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export default Signup;
