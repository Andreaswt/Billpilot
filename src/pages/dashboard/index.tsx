import React from "react";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { Button } from "@saas-ui/react";
import Link from "next/link";

const SimpleCard: NextPage = () => {

  const { data, isLoading } = trpc.useQuery([
    "invoices.test"
  ]);

  return (
    <>
    <h1>dashboard</h1>
    <Link href={"/api/xero/redirect"}>
      Connect til xero
    </Link>
    </>
  );
}

export default SimpleCard;