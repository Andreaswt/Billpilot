import { NextPage } from "next";
import { requireAuth } from "../../common/requireAuth";

import {
  Page, PageBody
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