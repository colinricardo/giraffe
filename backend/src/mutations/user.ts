import { builder } from "@/schemas/builder";
import { userSetters } from "@/setters/user";

builder.mutationFields((t) => ({
  launchUser: t.prismaField({
    type: "User",
    errors: {
      types: [Error],
    },
    args: {
      userId: t.arg.string({ required: true }),
      email: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args, ctx, info) => {
      const { userId, email } = args;
      console.log("launchUser", userId, email);
      const { user } = await userSetters.launchUser({ userId, email });
      return { user };
    },
  }),
}));
