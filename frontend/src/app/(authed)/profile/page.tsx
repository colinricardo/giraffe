import User from "@/components/User";
import { currentUser } from "@clerk/nextjs/server";

export default async () => {
  const user = await currentUser();
  const userId = user?.id;

  const renderMain = () => {
    return (
      <div className="flex flex-col items-center space-y-4 text-center justify-center w-full p-4">
        <User />
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Profile</h1>
      </div>
      <div className="flex">{renderMain()}</div>
    </>
  );
};
