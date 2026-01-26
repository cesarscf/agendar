import z from "zod";

export const establishmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  theme: z.string(),
  about: z.string(),
  bannerUrl: z.string(),
  logoUrl: z.string(),
  phone: z.string(),
  servicesPerformed: z.string(),
  activeCustomers: z.string(),
  experienceTime: z.string(),
  googleMapsLink: z.string(),
  address: z.string(),
  active: z.boolean(),
});

export const updateEstablishmentSchema = establishmentSchema.partial().extend({
  id: z.string().min(1, "ID obrigatório"),
});

export type Establishment = z.infer<typeof establishmentSchema>;
export type UpdateEstablishmentRequest = z.infer<
  typeof updateEstablishmentSchema
>;
