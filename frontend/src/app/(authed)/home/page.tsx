import { graphql } from "@/gql";
import { request } from "@/lib/graphql-request-server";

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

export default async () => {
  try {
    const data = await request(getUserQuery);

    return (
      <>
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Home</h1>
        </div>
        <div className="flex flex-col items-center space-y-4 text-center justify-center w-full p-4">
          <p className="text-sm text-muted-foreground">
            You are signed in as: {data.id}
          </p>
        </div>
      </>
    );
  } catch (error) {
    return <div>Could not load user.</div>;
  }
};
