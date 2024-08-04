import prisma from "@/prisma/client";

const getUserById = async ({ userId }: { userId: string }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found!");
  }

  return { user };
};

export const userGetters = {
  getUserById,
};
