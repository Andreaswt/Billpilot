import React, { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  VStack,
  FormErrorMessage,
  Divider,
  Collapse,
  useDisclosure,
  Tabs, TabList, TabPanels, Tab, TabPanel
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";

//icons
import { NextPage } from "next";
import ApiKeyTab from "../../components/settings/api-keys-tab";
import { requireAuth } from "../../common/requireAuth";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const SettingsPage: NextPage = () => {
  return (
    <>
      <Tabs colorScheme="black">
        <TabList>
          <Tab>
            <p>Profile</p>
          </Tab>
          <Tab>
            <p>Api Keys</p>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>Profile</p>
          </TabPanel>
          <TabPanel>
            <ApiKeyTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default SettingsPage;