import { NextPage } from "next";
import { requireAuth } from "../../common/requireAuth";

import { Button, ButtonGroup, Flex, Grid, GridItem, Heading, IconButton } from '@chakra-ui/react';
import { IoIosPaper, IoMdCalendar } from 'react-icons/io'
import { MdPayment } from 'react-icons/md'
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Clients } from "../../components/dashboard/clients";
import { Today } from "../../components/dashboard/today";

import {
  Page, PageBody, Toolbar,
  ToolbarButton
} from '@saas-ui/pro';
import RevenueChart from "../../components/dashboard/RevenueChart";
import { trpc } from "../../utils/trpc";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const SimpleCard: NextPage = () => {
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

  const { data, isLoading } = trpc.useQuery(["dashboard.getDashboard"], {
    refetchOnWindowFocus: false,
  });

  const todayData = [
    {
      label: 'Total Hours Billed',
      icon: IoIosPaper,
      value: data?.totalHoursBilled || "",
      change: data?.totalHoursBilledChange || 0,
    },
    {
      label: 'Total Billable Hours',
      icon: MdPayment,
      value: data?.totalBillableHours || "",
      change: -10,
    },
    {
      label: 'Total Hours Due',
      icon: IoMdCalendar,
      value: data?.totalHoursDue || "",
      // change: 0,
    },
    {
      label: 'Total Due',
      icon: IoMdCalendar,
      value: data?.totalDue || "",
      // change: 0,
    },
  ]

  return (
    <Page title={"Dashboard"} isLoading={isLoading}>
      <PageBody pt="8">
        {/* <IntroTour /> */}
        {
          data
            ? <>
              <Flex justifyContent="space-between" px={4}>
                <Flex gap={4}>
                  <Flex gap={2}>
                    <IconButton icon={<FiArrowLeft />} aria-label="Previous Month" />
                    <IconButton icon={<FiArrowRight />} aria-label="Next Month" />
                  </Flex>
                  <Heading>
                    {data.month || ""} {data.year}
                  </Heading>
                </Flex>
                <Flex gap={4}>
                  <Button colorScheme="primary">Create Invoice</Button>
                  <ButtonGroup isAttached variant="outline">
                    <Button>Year</Button>
                    <Button isActive>Month</Button>
                  </ButtonGroup>
                </Flex>
              </Flex>
              <Grid
                templateColumns={['repeat(1, 1fr)', null, 'repeat(1, 1fr)']}
                width="100%"
                gap="4"
                p="4"
              >
                <GridItem>
                  <Today data={todayData} />
                </GridItem>
                <GridItem>
                  <RevenueChart recentInvoices={data.recentInvoices} />
                </GridItem>


                <GridItem>
                  <Clients clients={data.clients} />
                </GridItem>
              </Grid>
            </>
            : null
        }
      </PageBody>
    </Page>
  )
}

export default SimpleCard;