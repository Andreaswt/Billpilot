import React from "react";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { Button } from "@saas-ui/react";
import Link from "next/link";
import { requireAuth } from "../../common/requireAuth";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const SimpleCard: NextPage = () => {

  // const { data, isLoading } = trpc.useQuery([
  //   "invoices.test"
  // ]);

  return (
    <>
    <h1>dashboard</h1>
    <Link href={"/api/xero/redirect"}>
      Connect til xero
    </Link>
    <br></br>
    <Link href={"/api/economic/redirect"}>
      Connect til economic
    </Link>
    </>
  );
}

export default SimpleCard;