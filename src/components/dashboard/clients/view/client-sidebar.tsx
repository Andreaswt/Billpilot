import * as React from 'react'

import { Persona, Property, PropertyList } from '@saas-ui/react'

import { Heading } from '@chakra-ui/react'
import { Currency, Prisma } from '@prisma/client'
import {
  PageSidebar, PageSidebarBody, PageSidebarHeader, PageSidebarProps
} from '@saas-ui/pro'

export interface ClientSidebarProps extends PageSidebarProps {
  client?: {
    name: string;
    currency: Currency;
    roundingScheme: string;
    createdAt: Date;
    latestBill: Date | null;
    status: string;
    pricePerHour: Prisma.Decimal;
  }
  economicOptions?: {
    customer: string;
    text1: string;
    ourReference: string;
    customerContact: string;
    unit: string;
    layout: string;
    vatZone: string;
    paymentTerms: string;
    product: string;
  }
}

export const ClientSidebar: React.FC<ClientSidebarProps> = (props) => {
  const { client, economicOptions, ...rest } = props

  return (
    <PageSidebar
      defaultWidth={400}
      minWidth="200px"
      maxWidth="500px"
      borderLeftWidth="1px"
      isResizable
      {...rest}
    >
      <PageSidebarHeader>
        <Persona name={client?.name || ''} size="xs" />
      </PageSidebarHeader>
      <PageSidebarBody>
        <PropertyList>
        <Heading size="md">Invoice</Heading>
          <Property label="Currency" value={client?.currency} />
          <Property label="Rounding Scheme" value={client?.roundingScheme} />
          <Property label="Created At" value={client?.createdAt.toISOString()} />
          <Property label="Latest Bill" value={client?.latestBill ? client?.latestBill.toISOString() : "-"} />
          <Property label="Status" value={client?.status} />
          <Property label="Price per Hour" value={Number(client?.pricePerHour)} />
        </PropertyList>
        {economicOptions
        ? <PropertyList>
        <Heading size="md">E-conomic</Heading>
        <Property label="Customer" value={economicOptions?.customer} />
        <Property label="Text 1" value={economicOptions?.text1} />
        <Property label="Our Reference" value={economicOptions?.ourReference} />
        <Property label="Customer Contact" value={economicOptions?.customerContact} />
        <Property label="Unit" value={economicOptions?.unit} />
        <Property label="Layout" value={economicOptions?.layout} />
        <Property label="Vat Zone" value={economicOptions?.vatZone} />
        <Property label="Payment Terms" value={economicOptions?.paymentTerms} />
        <Property label="Product" value={economicOptions?.product} />
      </PropertyList>
      : null}
        
      </PageSidebarBody>
    </PageSidebar>
  )
}
