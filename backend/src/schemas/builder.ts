import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
// This is the default location for the generator, but this can be
// customized.
// Using a type only import will help avoid issues with undeclared
// exports in esm mode.
import ErrorsPlugin from "@pothos/plugin-errors";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import prisma from "../prisma/client";

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin, ErrorsPlugin],
  prisma: {
    client: prisma,
    filterConnectionTotalCount: true,
    onUnusedQuery: process.env.NODE_ENV === "production" ? null : "warn",
  },
  errors: {
    defaultTypes: [],
  },
});

builder.objectType(Error, {
  name: "Error",
  fields: (t) => ({
    message: t.exposeString("message"),
  }),
});

builder.queryType({});
builder.mutationType({});
// builder.subscriptionType({});
