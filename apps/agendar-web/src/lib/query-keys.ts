/**
 * Centralized query keys for React Query
 * This ensures consistent cache invalidation across the app
 */

export const queryKeys = {
  // Auth & Partner
  partner: ["partner"] as const,
  subscriptions: ["subscriptions"] as const,
  establishment: ["establishment"] as const,

  // Employees
  employees: ["employees"] as const,
  employee: (id: string) => ["employee", id] as const,
  employeeBlocks: (id: string) => ["employee", id, "blocks"] as const,
  employeeRecurringBlocks: (id: string) =>
    ["employee", id, "recurring-blocks"] as const,

  // Services
  services: ["services"] as const,
  service: (id: string) => ["service", id] as const,

  // Categories
  categories: ["categories"] as const,
  category: (id: string) => ["category", id] as const,

  // Packages
  packages: ["packages"] as const,
  package: (id: string) => ["package", id] as const,

  // Customers
  customers: ["customers"] as const,
  customer: (id: string) => ["customer", id] as const,
  customerPackages: (id: string) => ["customer", id, "packages"] as const,
  customerLoyaltyPrograms: (id: string) =>
    ["customer", id, "loyalty-programs"] as const,
  customersWithActivePackage: ["customers", "with-active-package"] as const,

  // Appointments
  appointments: (params?: Record<string, unknown>) =>
    params ? (["appointments", params] as const) : (["appointments"] as const),

  // Loyalty Programs
  loyaltyPrograms: ["loyalty-programs"] as const,
  loyaltyProgram: (id: string) => ["loyalty-program", id] as const,
  checkBonus: (customerId: string, serviceId: string) =>
    ["check-bonus", customerId, serviceId] as const,

  // Plans & Payments
  plans: ["plans"] as const,
  plan: (id: string) => ["plan", id] as const,
  paymentMethods: ["payment-methods"] as const,

  // Reports
  dailyRevenue: (params: { startDate: string; endDate: string }) =>
    ["reports", "daily-revenue", params] as const,
  netRevenue: (params: { startDate: string; endDate: string }) =>
    ["reports", "net-revenue", params] as const,
  averageTicket: (params: { startDate: string; endDate: string }) =>
    ["reports", "average-ticket", params] as const,
  appointmentsCount: (params: { startDate: string; endDate: string }) =>
    ["reports", "appointments-count", params] as const,
  topPaymentMethods: (params: { startDate: string; endDate: string }) =>
    ["reports", "top-payment-methods", params] as const,
  topServices: (params: { startDate: string; endDate: string }) =>
    ["reports", "top-services", params] as const,
  mostBookedServices: (params: { startDate: string; endDate: string }) =>
    ["reports", "most-booked-services", params] as const,
  employeeCommission: (params: { startDate: string; endDate: string }) =>
    ["reports", "employee-commission", params] as const,
  employeeRevenue: (params: { startDate: string; endDate: string }) =>
    ["reports", "employee-revenue", params] as const,
  servicesByEmployee: (params: { startDate: string; endDate: string }) =>
    ["reports", "services-by-employee", params] as const,
  monthlyServices: (params: { serviceId?: string }) =>
    ["reports", "monthly-services", params] as const,

  // Public endpoints
  public: {
    establishment: (slug: string) => ["public", "establishment", slug] as const,
    services: (slug: string) => ["public", "services", slug] as const,
    service: (slug: string, serviceId: string) =>
      ["public", "service", slug, serviceId] as const,
    serviceProfessionals: (slug: string, serviceId: string) =>
      ["public", "service-professionals", slug, serviceId] as const,
    packages: (slug: string) => ["public", "packages", slug] as const,
    package: (slug: string, packageId: string) =>
      ["public", "package", slug, packageId] as const,
    professionals: (slug: string) => ["public", "professionals", slug] as const,
    professional: (slug: string, professionalId: string) =>
      ["public", "professional", slug, professionalId] as const,
    professionalServices: (slug: string, professionalId: string) =>
      ["public", "professional-services", slug, professionalId] as const,
    loyalties: (slug: string) => ["public", "loyalties", slug] as const,
    timeSlots: (slug: string, params: Record<string, unknown>) =>
      ["public", "time-slots", slug, params] as const,
  },
} as const;
