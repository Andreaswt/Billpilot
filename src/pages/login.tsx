import type { NextPage } from 'next';
import { SEO } from '../components/landing-page/seo/seo';

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box, Button, Heading, Checkbox, useColorModeValue, Container, FormControl, FormErrorMessage, FormLabel, Input, InputGroup,
  InputRightElement, Stack, Text
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from '@saas-ui/react';
import { signIn, useSession } from "next-auth/react";
import NextLink from 'next/link';
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema } from "../common/validation/auth";
import { BackgroundGradient } from '../components/landing-page/gradients/background-gradient';

//icons

const LoginPage: NextPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  });

  interface ILogin {
    email: string;
    password: string;
  }

  const onSubmit = useCallback(async (data: ILogin) => {
    await signIn("credentials", { ...data, callbackUrl: "/dashboard" });
  }, []);

  if (status === "authenticated") {
    router.push("/dashboard");
  }

  return (
    <Box>
      <SEO
        title="Saas UI Landingspage"
        description="Free SaaS landingspage starter kit"
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
                <Container>
                  <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                    <Heading textAlign="center" color={useColorModeValue('gray.800', 'white')} fontSize="3xl" zIndex='9999'>
                      Welcome back
                    </Heading>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Stack spacing={4} pt={10}>
                        <FormControl
                          id="email"
                          isInvalid={Boolean(router.query.error)}
                          isRequired
                        >
                          <FormLabel>Email</FormLabel>
                          <Input type="email" {...register("email")} />
                        </FormControl>
                        <FormControl
                          id="password"
                          isRequired
                          isInvalid={Boolean(router.query.error)}
                        >
                          <FormLabel>Password</FormLabel>
                          <InputGroup>
                            <Input
                              type={showPassword ? "text" : "password"}
                              {...register("password")}
                            />
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
                                {showPassword ? (
                                  <ViewIcon />
                                ) : (
                                  <ViewOffIcon />
                                )}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                          {router.query.error &&
                            router.query.error === "CredentialsSignin" && (
                              <FormErrorMessage>
                                Invalid credentials
                              </FormErrorMessage>
                            )}
                        </FormControl>
                        <Stack spacing={10}>
                          <Stack
                            direction={{ base: "column", sm: "row" }}
                            align={"start"}
                            justify={"space-between"}
                          >
                            <Checkbox>Remember me</Checkbox>
                            <NextLink href="/signup">Forgot password?</NextLink>
                          </Stack>
                          <Button
                            isLoading={isSubmitting}
                            loadingText="Signing in..."
                            colorScheme="primary"
                            color={"white"}
                            type="submit"
                          >
                            Sign in
                          </Button>
                        </Stack>
                        <Stack pt={6}>
                          <Text align={"center"}>
                            Not a user yet?{" "}
                            <NextLink href={"/signup"}>
                              Register
                            </NextLink>
                          </Text>
                        </Stack>
                      </Stack>
                    </form>
                  </Stack>
                </Container>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage;