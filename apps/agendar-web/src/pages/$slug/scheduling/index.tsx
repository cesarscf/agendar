import { createFileRoute } from "@tanstack/react-router"
import { ThemeWrapper } from "@/components/theme-wrapper"
import { getPublicEstablishment } from "@/http/public/get-public-establishment"
import { SchedulingFromPackage } from "./-components/scheduling-from-package"
import { SchedulingFromProfessional } from "./-components/scheduling-from-professional"
import { SchedulingFromService } from "./-components/scheduling-from-service"

export const Route = createFileRoute("/$slug/scheduling/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const slug = params.slug

    const data = await getPublicEstablishment(slug)

    return {
      ...data,
    }
  },
  validateSearch: (search: Record<string, unknown>) => {
    return {
      professionalId:
        typeof search.professionalId === "string"
          ? search.professionalId
          : undefined,
      serviceId:
        typeof search.serviceId === "string" ? search.serviceId : undefined,
      packageId:
        typeof search.packageId === "string" ? search.packageId : undefined,
    }
  },
})

function RouteComponent() {
  const establishment = Route.useLoaderData()

  const { slug } = Route.useParams()
  const { professionalId, serviceId, packageId } = Route.useSearch()

  if (!establishment) return

  return (
    <ThemeWrapper theme={establishment.theme}>
      {serviceId && (
        <SchedulingFromService
          serviceId={serviceId}
          slug={slug}
          establishment={establishment}
        />
      )}
      {professionalId && (
        <SchedulingFromProfessional
          professionalId={professionalId}
          slug={slug}
          establishment={establishment}
        />
      )}
      {packageId && (
        <SchedulingFromPackage
          packageId={packageId}
          slug={slug}
          establishment={establishment}
        />
      )}
    </ThemeWrapper>
  )
}
