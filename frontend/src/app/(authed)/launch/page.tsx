import { ROUTE_HOME, ROUTE_SIGN_IN } from "@/lib/routes";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { API_URL } from "@/app/config";
import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient(API_URL);

const launchUserMutation = gql`
  mutation LaunchUser($userId: String!, $email: String!) {
    launchUser(userId: $userId, email: $email) {
      ... on Error {
        message
      }
      ... on MutationLaunchUserSuccess {
        data {
          id
        }
      }
    }
  }
`;

export default async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect(ROUTE_SIGN_IN);
  }

  const user = await currentUser();

  const { id, emailAddresses } = user!;
  const { emailAddress: email } = emailAddresses[0];

  await client
    .request(launchUserMutation, {
      userId: id,
      email: email!,
    })
    .catch((error) => {
      console.log({ error });
      return redirect(ROUTE_SIGN_IN);
    });

  redirect(ROUTE_HOME);
};
