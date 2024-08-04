import { API_URL } from "@/app/config";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { getCookie } from "cookies-next";
import { GraphQLClient, Variables } from "graphql-request";

const client = new GraphQLClient(API_URL);

type ErrorResult = {
  __typename: "Error";
  message: string;
};

type SuccessResult<T> = {
  [K in keyof T]: T[K] extends { __typename: string; data: any } ? T[K] : never;
};

type GraphQLResponse<T> = SuccessResult<T> | { [key: string]: ErrorResult };

type ExtractQueryData<T> = T extends { [K in keyof T]: infer U }
  ? U extends { __typename: string; data: infer D }
    ? D
    : never
  : never;

export const request = async <TResult, TVariables extends Variables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables
): Promise<ExtractQueryData<TResult>> => {
  const authToken = getCookie("__session");

  const result = await client.request<GraphQLResponse<TResult>>(
    document,
    variables,
    {
      "x-auth-token": authToken ?? "",
    }
  );

  const [queryResultKey, queryResult] = Object.entries(result)[0];

  if (typeof queryResult === "object" && queryResult !== null) {
    if ("__typename" in queryResult) {
      if (queryResult.__typename === "Error") {
        throw new Error((queryResult as ErrorResult).message);
      } else if ("data" in queryResult) {
        return queryResult.data as ExtractQueryData<TResult>;
      }
    }
  }

  throw new Error(`Unexpected response structure for query: ${queryResultKey}`);
};
