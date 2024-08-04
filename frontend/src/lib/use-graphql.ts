"use client";

import { request } from "@/lib/graphql-request-client";
import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { Variables } from "graphql-request";

type ExtractQueryData<T> = T extends { [K in keyof T]: infer U }
  ? U extends { __typename: string; data: infer D }
    ? D
    : never
  : never;

export const useGraphQL = <TResult, TVariables extends Variables>(
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): UseQueryResult<ExtractQueryData<TResult>, Error> => {
  return useQuery({
    queryKey: [(document.definitions[0] as any).name.value, variables],
    queryFn: async ({ queryKey }): Promise<ExtractQueryData<TResult>> => {
      const result = await request<TResult, TVariables>(
        document,
        queryKey[1] ? queryKey[1] : undefined
      );

      return result;
    },
  });
};
