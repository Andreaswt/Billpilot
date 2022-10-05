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

const CreateInvoice: NextPage = () => {
  const organization = "Dashboard";
  let isLoading = false;

  return (
    <Page title={"Dashboard"} isLoading={isLoading}>
      <PageBody pt="8">
        <p>Not implemented</p>
      </PageBody>
    </Page>
  )
}

export default CreateInvoice;