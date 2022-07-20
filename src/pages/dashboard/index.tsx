import React from "react";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";

const SimpleCard: NextPage = () => {
  
  const { data, isLoading } = trpc.useQuery([
    "jira.test"
]);


  return (
    <><h1>dashboard</h1></>
  );
}

export default SimpleCard;