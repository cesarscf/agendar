import {
  addMinutes,
  format,
  getDay,
  isAfter,
  isBefore,
  isEqual,
} from "date-fns"
import { and, eq, gte, lte, ne } from "drizzle-orm"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { db } from "@/db"
import {
  appointments,
  employeeRecurringBlocks,
  employeeTimeBlocks,
  establishmentAvailability,
  services,
} from "@/db/schema"
import { DateUtils } from "@/utils/get-date"

export async function getAvailability(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/availability",
    {
      schema: {
        tags: ["Availability"],
        summary: "Get available time slots",
        querystring: z.object({
          date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          employeeId: z.string().uuid(),
          serviceId: z.string().uuid(),
          establishmentId: z.string().uuid(),
        }),
        response: {
          200: z.object({ items: z.array(z.date()) }),
        },
      },
    },
    async (request, reply) => {
      const { date, employeeId, serviceId, establishmentId } = request.query

      const parsedDate = DateUtils.parse(date)
      const weekday = getDay(parsedDate)

      console.log({ parsedDate, weekday })
      const availability = await db.query.establishmentAvailability.findFirst({
        where: and(
          eq(establishmentAvailability.establishmentId, establishmentId),
          eq(establishmentAvailability.weekday, weekday)
        ),
      })

      if (!availability) return reply.send({ items: [] })

      const service = await db.query.services.findFirst({
        where: eq(services.id, serviceId),
        columns: { durationInMinutes: true },
      })

      if (!service) return reply.send({ items: [] })

      const {
        opensAt: startTime,
        closesAt: endTime,
        breakStart,
        breakEnd,
      } = availability
      const serviceDuration = service.durationInMinutes

      const intentionalAppointmentStartDatetime =
        DateUtils.combineDateAndTimeUTC(parsedDate, startTime)
      const intentionalAppointmentEndDateTime = DateUtils.combineDateAndTimeUTC(
        parsedDate,
        endTime
      )
      const breakS = breakStart ? new Date(`${date}T${breakStart}`) : null
      const breakE = breakEnd ? new Date(`${date}T${breakEnd}`) : null

      const allSlots: Date[] = []
      let current = new Date(intentionalAppointmentStartDatetime)
      while (
        isBefore(
          addMinutes(current, serviceDuration),
          intentionalAppointmentEndDateTime
        ) ||
        isEqual(
          addMinutes(current, serviceDuration),
          intentionalAppointmentEndDateTime
        )
      ) {
        const next = addMinutes(current, serviceDuration)

        const inBreak =
          breakS && breakE && isBefore(current, breakE) && isAfter(next, breakS)

        if (!inBreak) allSlots.push(new Date(current))
        current = next
      }

      const startOfDay = new Date(`${date}T00:00:00`)
      const endOfDay = new Date(`${date}T23:59:59`)

      const [timeBlocks, recurringBlocks, existingAppointments] =
        await Promise.all([
          db
            .select()
            .from(employeeTimeBlocks)
            .where(
              and(
                eq(employeeTimeBlocks.employeeId, employeeId),
                lte(employeeTimeBlocks.startsAt, endOfDay),
                gte(employeeTimeBlocks.endsAt, startOfDay)
              )
            ),

          db
            .select()
            .from(employeeRecurringBlocks)
            .where(
              and(
                eq(employeeRecurringBlocks.employeeId, employeeId),
                eq(employeeRecurringBlocks.weekday, weekday)
              )
            ),

          db
            .select()
            .from(appointments)
            .where(
              and(
                eq(appointments.employeeId, employeeId),
                eq(appointments.establishmentId, establishmentId),
                gte(appointments.startTime, startOfDay),
                lte(appointments.endTime, endOfDay),
                ne(appointments.status, "canceled")
              )
            ),
        ])

      const isSlotBlocked = (slot: Date): boolean => {
        const slotEnd = addMinutes(slot, serviceDuration)

        for (const block of timeBlocks) {
          if (
            isBefore(slot, block.endsAt) &&
            isAfter(slotEnd, block.startsAt)
          ) {
            return true
          }
        }

        for (const block of recurringBlocks) {
          const blockStart = DateUtils.combineDateAndTimeUTC(
            parsedDate,
            block.startTime
          )
          const blockEnd = DateUtils.combineDateAndTimeUTC(
            parsedDate,
            block.endTime
          )

          if (isBefore(slot, blockEnd) && isAfter(slotEnd, blockStart)) {
            return true
          }
        }

        for (const appt of existingAppointments) {
          if (
            isBefore(slot, appt.endTime) &&
            isAfter(slotEnd, appt.startTime)
          ) {
            return true
          }
        }

        return false
      }

      const now = new Date()
      const today = format(now, "yyyy-MM-dd")
      const isToday = date === today

      const availableSlots = allSlots
        .filter(slot => !isSlotBlocked(slot))
        .filter(slot => {
          if (!isToday) return true
          return isAfter(slot, now)
        })
        .map(slot => slot)

      console.log({ allSlots, availability })

      return reply.send({ items: availableSlots })
    }
  )
}
