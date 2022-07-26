import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { logger } from "../../../lib/logger";
import { useRouter } from "next/router";
import { resetLevel } from "loglevel";
import { NextPage } from "next";
import { ISignUp, signUpSchema } from "../../common/validation/auth";
import { trpc } from "../../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";

const SignupCard: NextPage = () => {
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
          `signin${router.query.callbackUrl
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
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={8}
        mx={"auto"}
        w={{ md: "md" }}
        maxW={"lg"}
        py={12}
        px={6}
      >
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
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
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link color={"blue.400"} href="signin">
                    Sign in
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}

export default SignupCard;