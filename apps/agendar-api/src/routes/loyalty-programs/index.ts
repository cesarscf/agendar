import type { FastifyInstance } from "fastify"
import { addLoyaltyServices } from "@/routes/loyalty-programs/add-loyalty-services"
import { createLoyaltyProgram } from "@/routes/loyalty-programs/create-loyalty-program"
import { deleteLoyaltyProgram } from "@/routes/loyalty-programs/delete-loyalty-program"
import { getByIdLoyaltyProgram } from "@/routes/loyalty-programs/get-by-id-loyalty-program"
import { getLoyaltyPrograms } from "@/routes/loyalty-programs/get-loyalty-programs"
import { listLoyaltyProgramServices } from "@/routes/loyalty-programs/list-loyalty-program-services"
import { permanentDeleteLoyaltyProgram } from "@/routes/loyalty-programs/permanent-delete-loyalty-program"
import { removeLoyaltyService } from "@/routes/loyalty-programs/remove-loyalty-service"
import { updateLoyaltyProgram } from "@/routes/loyalty-programs/update-loyalty-program"
import { updateLoyaltyService } from "@/routes/loyalty-programs/update-loyalty-service"

export async function loyaltyProgramsRoutes(app: FastifyInstance) {
  await createLoyaltyProgram(app)
  await getLoyaltyPrograms(app)
  await updateLoyaltyProgram(app)
  await deleteLoyaltyProgram(app)
  await permanentDeleteLoyaltyProgram(app)
  await getByIdLoyaltyProgram(app)
  await addLoyaltyServices(app)
  await listLoyaltyProgramServices(app)
  await updateLoyaltyService(app)
  await removeLoyaltyService(app)
}
