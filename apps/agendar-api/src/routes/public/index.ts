import { createCustomer } from "@/routes/public/create-customer"
import { getEstablishmentInfo } from "@/routes/public/get-establishment-info"
import { getEstablishmentPackages } from "@/routes/public/get-establishment-packages"
import { getEstablishmentProfessionals } from "@/routes/public/get-establishment-professionals"
import { getEstablishmentServices } from "@/routes/public/get-establishment-services"
import { getProfessionalServices } from "@/routes/public/get-professional-services"
import { getServiceProfessionals } from "@/routes/public/get-service-professionals"
import type { FastifyInstance } from "fastify"

import { cancelAppointmentPublic } from "./cancel-appointment"
import { getCustomerInfoByPhone } from "./get-customer-info-by-phone"
import { getEstablishmentProfessionalById } from "./get-establishment-professional-by-id"
import { getEstablishmentServiceById } from "./get-establishment-service-by-id"
import { getPublicLoyaltyPrograms } from "./get-public-loyalty-programs"
import { getEstablishmentPackageById } from "./get-stablishment-package-by-id"

export async function publicRoutes(app: FastifyInstance) {
  await getEstablishmentInfo(app)
  await getEstablishmentServices(app)
  await getEstablishmentProfessionals(app)
  await getEstablishmentPackages(app)
  await getServiceProfessionals(app)
  await getProfessionalServices(app)
  await createCustomer(app)
  await getEstablishmentServiceById(app)
  await getEstablishmentProfessionalById(app)
  await getEstablishmentPackageById(app)
  await getPublicLoyaltyPrograms(app)
  await getCustomerInfoByPhone(app)
  await cancelAppointmentPublic(app)
}
