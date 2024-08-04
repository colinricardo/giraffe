import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

import { Inter as FontSans } from "next/font/google";

import TailwindIndicator from "@/components/common/TailwindIndicator";
import ReactQueryProvider from "@/lib/react-query-provider";
// import ActiveModals from "@/app/components/modals/ActiveModals";
import { TooltipProvider } from "@/components/ui/tooltip";
import { JotaiProvider } from "@/lib/jotai-provider";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Extractabot",
  description: "",
};

export default ({ children }: { children: React.ReactNode }) => {
  const renderContent = () => (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ReactQueryProvider>
              <JotaiProvider>
                <TooltipProvider>{children}</TooltipProvider>
                {/* <ActiveModals /> */}
              </JotaiProvider>
            </ReactQueryProvider>
          </ThemeProvider>
          <TailwindIndicator />

          <div className="absolute bottom-0 right-0">
            <Toaster richColors position="bottom-left" />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );

  return renderContent();
};
