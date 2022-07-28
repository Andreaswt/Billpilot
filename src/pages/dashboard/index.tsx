import { NextPage } from "next";
import { requireAuth } from "../../common/requireAuth";

import { Grid, GridItem } from '@chakra-ui/react';

import { FaGithub, FaTwitter } from 'react-icons/fa';
import { MRR } from "../../components/dashboard/mrr";
import { SalesByCountry } from "../../components/dashboard/sales-by-country";
import { Today } from "../../components/dashboard/today";

import {
  Page, PageBody, Toolbar,
  ToolbarButton
} from '@saas-ui/pro';

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const SimpleCard: NextPage = () => {
  const organization = "Dashboard";
  let isLoading = false;

  const toolbar = (
    <Toolbar className="overview-toolbar">
      <ToolbarButton
        as="a"
        href="https://twitter.com/intent/tweet?text=Check%20out%20%40saas_js,%20an%20advanced%20component%20library%20for%20SaaS%20products%20build%20with%20%40chakra_ui.%20https%3A//saas-ui.dev%20"
        icon={<FaTwitter />}
        label="Share on Twitter"
      />
      <ToolbarButton
        as="a"
        href="https://github.com/saas-js/saas-ui"
        icon={<FaGithub />}
        label="Star on Github"
      />
      <ToolbarButton
        as="a"
        href="https://appulse.gumroad.com/l/saas-ui-pro-pre-order"
        label="Pre-order"
        colorScheme="primary"
        variant="solid"
        className="pre-order"
      />
    </Toolbar>
  )

  return (
    <Page title={"Dashboard"} toolbar={toolbar} isLoading={isLoading}>
      <PageBody pt="8">
        {/* <IntroTour /> */}
        <Grid
          templateColumns={['repeat(1, 1fr)', null, 'repeat(1, 1fr)']}
          width="100%"
          gap="4"
          p="4"
        >
          <GridItem>
            <Today />
          </GridItem>
          <GridItem>
            <MRR />
          </GridItem>
          <GridItem>
            <SalesByCountry />
          </GridItem>
        </Grid>
      </PageBody>
    </Page>
  )
}

export default SimpleCard;