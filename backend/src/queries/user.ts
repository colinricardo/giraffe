import { userGetters } from "@/getters/user";
import { builder } from "@/schemas/builder";

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
  }),
});

builder.queryFields((t) => ({
  currentUser: t.prismaField({
    type: "User",
    errors: {
      types: [Error],
    },
    resolve: async (query, root, args, ctx, info) => {
      const { userId } = ctx;
      const { user } = await userGetters.getUserById({ userId });
      return user;
    },
  }),
}));
