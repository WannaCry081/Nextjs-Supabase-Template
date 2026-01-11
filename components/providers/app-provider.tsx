import { Toaster } from "sonner";
import { PropsWithChildren } from "react";
import NextTopLoader from "nextjs-toploader";

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
      <NextTopLoader showSpinner={false} easing="ease-out" />
      {children}
      <Toaster position="top-center" />
    </>
  );
};
