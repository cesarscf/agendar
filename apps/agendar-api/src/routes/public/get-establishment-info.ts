import { db } from "@/db"
import { establishmentAvailability, establishments } from "@/db/schema"
import { availabilitySchema } from "@/utils/schemas/availability"
import { eq } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

export async function getEstablishmentInfo(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:slug",
    {
      schema: {
        tags: ["Public"],
        summary: "Exibir informações públicas da loja",
        params: z.object({ slug: z.string() }),
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
            slug: z.string(),
            logoUrl: z.string().nullable(),
            bannerUrl: z.string().nullable(),
            theme: z.string(),
            about: z.string().nullable(),
            phone: z.string().nullable(),
            servicesPerformed: z.string().nullable(),
            activeCustomers: z.string().nullable(),
            experienceTime: z.string().nullable(),
            googleMapsLink: z.string().nullable(),
            address: z.string().nullable(),
            active: z.boolean(),
            availabilities: z.array(availabilitySchema),
          }),
        },
      },
    },
    async (req, reply) => {
      const { slug } = req.params

      const establishment = await db.query.establishments.findFirst({
        where: eq(establishments.slug, slug),
        columns: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          bannerUrl: true,
          about: true,
          activeCustomers: true,
          address: true,
          googleMapsLink: true,
          experienceTime: true,
          phone: true,
          servicesPerformed: true,
          theme: true,
          active: true,
        },
      })

      console.log(establishment)

      if (!establishment) return reply.status(404).send()

      const data = await db
        .select()
        .from(establishmentAvailability)
        .where(eq(establishmentAvailability.establishmentId, establishment.id))

      const result = {
        ...establishment,
        availabilities: data.map(it => ({
          id: it.id,
          establishmentId: it.establishmentId,
          weekday: it.weekday,
          opensAt: it.opensAt,
          closesAt: it.closesAt,
          breakStart: it.breakStart,
          breakEnd: it.breakEnd,
        })),
      }

      return reply.send(result)
    }
  )
}
