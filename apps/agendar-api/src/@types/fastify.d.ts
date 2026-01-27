import "fastify"

declare module "fastify" {
  export interface FastifyRequest {
    getCurrentPartnerId(): Promise<string>
    getCurrentEstablishmentId(): Promise<{
      establishmentId: string
      partnerId: string
    }>
    getCurrentCustomerId(): Promise<string>
    getCurrentCustomerEstablishmentId(): Promise<{
      establishmentId: string
      customerId: string
    }>
    getActiveSubscription(): {
      id: string
      partnerId: string
      planId: string
      integrationSubscriptionId: string
      status: string
      currentPeriodEnd: Date
      cancelAtPeriodEnd: boolean | null
      endedAt: Date | null
      createdAt: Date
      updatedAt: Date | null
    }
    getCurrentAdminId(): string
    getCurrentAdminRole(): string | null
  }
}
