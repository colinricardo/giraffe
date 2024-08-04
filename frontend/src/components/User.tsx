"use client";

import { graphql } from "@/gql";
import { useGraphQL } from "@/lib/use-graphql";

const getUserQuery = graphql(`
  query CurrentUser {
    currentUser {
      __typename
      ... on QueryCurrentUserSuccess {
        data {
          id
          email
        }
      }
      ... on Error {
        message
      }
    }
  }
`);

export default () => {
  const { data, isLoading, error } = useGraphQL(getUserQuery);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div>{data?.id}</div>
      <div>{data?.email}</div>
    </div>
  );
};
