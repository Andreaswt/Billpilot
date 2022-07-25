import React from "react";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { Button } from "@saas-ui/react";

const SimpleCard: NextPage = () => {

  const { data, isLoading } = trpc.useQuery([
    "invoices.test"
  ]);

  return (
    <>
    <h1>dashboard</h1>
    <a href="/api/xero/redirect">
      hej
    </a>
    </>
  );
}

export default SimpleCard;