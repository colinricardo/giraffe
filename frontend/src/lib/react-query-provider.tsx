"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  const renderContent = () => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderContent();
};
