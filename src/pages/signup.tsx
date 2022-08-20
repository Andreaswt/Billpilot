import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, InputGroup,
  InputRightElement, Stack, Text, useColorModeValue
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ISignUp, signUpSchema } from "../common/validation/auth";
import { BackgroundGradient } from '../components/landing-page/gradients/background-gradient';
import { SEO } from '../components/landing-page/seo/seo';
import { trpc } from "../utils/trpc";


const SignupPage: NextPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ISignUp>({
    resolver: zodResolver(signUpSchema),
  });
  const { mutateAsync } = trpc.useMutation(["users.create"]);

  async function onSubmit(values: ISignUp) {
    try {
      const result = await mutateAsync(values);

      reset();

      if (result.status === 201) {
        router.push(
          `login${router.query.callbackUrl
            ? `?callbackUrl=${router.query.callbackUrl}`
            : ""
          }`,
        );
      }
    } catch (error) {
      console.error(error);
    }
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
                    <Heading textAlign="center" color={useColorModeValue('gray.800', 'white')} fontSize="3xl">
                      Sign up for access
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
              <FormControl isInvalid={!errors?.email?.message == false} id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" {...register("email")} />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
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
                  isLoading={isSubmitting}
                  colorScheme="purple"
                  color={"white"}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <NextLink color={"primary.400"} href="login">
                    Sign in
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

export default SignupPage;