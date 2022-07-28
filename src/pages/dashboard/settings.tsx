import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Page, PageBody } from "@saas-ui/pro";

//icons
import { NextPage } from "next";
import { requireAuth } from "../../common/requireAuth";
import ApiKeyTab from "../../components/settings/api-keys-tab";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const SettingsPage: NextPage = () => {
  return (
    <Page title={"Settings"}>
      <PageBody fullWidth={true}>
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
      </PageBody>
    </Page>
  );
}

export default SettingsPage;