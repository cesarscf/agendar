import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { NuqsAdapter } from "nuqs/adapters/react";
import React from "react";
import { I18nProvider } from "react-aria-components";

import { toast } from "sonner";

import { routeTree } from "@/router-tree.gen";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { useAuth } from "./hooks/use-auth";

const router = createRouter({
  routeTree,
  context: {
    auth: {
      isAuthenticated: false,
      partner: null,
      isLoading: false,
    },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}

export function App() {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
          },
          mutations: {
            onError(error) {
              if (error instanceof AxiosError) {
                const message =
                  error.response?.data?.message ??
                  "Erro inesperado no servidor.";

                toast.error(message);
                return;
              }

              toast.error("Erro desconhecido. Tente novamente mais tarde.");
            },
          },
        },
      }),
  );

  return (
    <I18nProvider locale="pt-BR">
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <InnerApp />
            <Toaster richColors />
          </ThemeProvider>
        </QueryClientProvider>
      </NuqsAdapter>
    </I18nProvider>
  );
}
