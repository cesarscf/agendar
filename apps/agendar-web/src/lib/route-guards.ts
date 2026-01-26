import { redirect } from "@tanstack/react-router"
import type { RouterContext } from "./router-context"

interface BeforeLoadContext {
  context: RouterContext
  location: {
    href: string
  }
}

export async function requireAuth({ context, location }: BeforeLoadContext) {
  if (context.auth.isLoading) {
    return
  }

  if (!context.auth.isAuthenticated) {
    throw redirect({
      to: "/login",
      search: {
        redirect: location.href,
      },
    })
  }
}
