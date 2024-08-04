import prisma from "@/prisma/client";
import { getUnixTimestamp } from "@/utils/general";

const launchUser = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  const user = await prisma.user.upsert({
    where: {
      id: userId,
    },
    update: {
      email,
      updatedAt: getUnixTimestamp(),
    },
    create: {
      id: userId,
      email,
      createdAt: getUnixTimestamp(),
      updatedAt: getUnixTimestamp(),
    },
  });

  return { user };
};

export const userSetters = {
  launchUser,
};
