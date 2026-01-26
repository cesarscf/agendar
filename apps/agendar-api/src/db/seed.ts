// @ts-nocheck

import { db } from "@/db"
import {
  appointments,
  categories,
  customerServicePackageUsages,
  customerServicePackages,
  customers,
  employees,
  establishments,
  loyaltyPointRules,
  loyaltyPrograms,
  packageItems,
  packages,
  serviceCategories,
  serviceToCategories,
  services,
} from "@/db/schema"
import { eq } from "drizzle-orm"

async function seed(establishmentId: string) {
  console.log("🌱 Iniciando seed do banco de dados...")
  console.log(`📍 Inserindo dados para o estabelecimento: ${establishmentId}`)

  try {
    const existingEstablishment = await db.query.establishments.findFirst({
      where: eq(establishments.id, establishmentId),
    })

    if (!existingEstablishment) {
      throw new Error(
        `Estabelecimento com ID ${establishmentId} não encontrado`
      )
    }

    const targetEstablishments = [existingEstablishment]
    console.log(`✅ Estabelecimento encontrado: ${existingEstablishment.name}`)

    // Reset: Limpar dados existentes do estabelecimento
    console.log("🧹 Limpando dados existentes...")

    // Deletar customer service package usages relacionados aos agendamentos
    const existingAppointments = await db.query.appointments.findMany({
      where: eq(appointments.establishmentId, establishmentId),
    })
    if (existingAppointments.length > 0) {
      for (const appointment of existingAppointments) {
        await db
          .delete(customerServicePackageUsages)
          .where(eq(customerServicePackageUsages.appointmentId, appointment.id))
      }
      console.log("✅ Customer service package usages removidos")
    }

    // Deletar agendamentos
    await db
      .delete(appointments)
      .where(eq(appointments.establishmentId, establishmentId))
    console.log("✅ Agendamentos removidos")

    // Deletar customer service packages usages relacionados aos clientes
    const existingCustomers = await db.query.customers.findMany({
      where: eq(customers.establishmentId, establishmentId),
    })
    if (existingCustomers.length > 0) {
      for (const customer of existingCustomers) {
        await db
          .delete(customerServicePackageUsages)
          .where(
            eq(
              customerServicePackageUsages.customerServicePackageId,
              customer.id
            )
          )
        await db
          .delete(customerServicePackages)
          .where(eq(customerServicePackages.customerId, customer.id))
      }
      console.log("✅ Customer service packages removidos")
    }

    // Deletar clientes
    await db
      .delete(customers)
      .where(eq(customers.establishmentId, establishmentId))
    console.log("✅ Clientes removidos")

    // Deletar relações serviço-categoria
    const existingServices = await db.query.services.findMany({
      where: eq(services.establishmentId, establishmentId),
    })
    if (existingServices.length > 0) {
      for (const service of existingServices) {
        await db
          .delete(serviceToCategories)
          .where(eq(serviceToCategories.serviceId, service.id))
        await db
          .delete(serviceCategories)
          .where(eq(serviceCategories.serviceId, service.id))
      }
      console.log("✅ Relações serviço-categoria removidas")
    }

    // Deletar serviços
    await db
      .delete(services)
      .where(eq(services.establishmentId, establishmentId))
    console.log("✅ Serviços removidos")

    // Deletar funcionários
    await db
      .delete(employees)
      .where(eq(employees.establishmentId, establishmentId))
    console.log("✅ Funcionários removidos")

    // Deletar loyalty point rules relacionados ao estabelecimento
    const existingLoyaltyPrograms = await db.query.loyaltyPrograms.findMany({
      where: eq(loyaltyPrograms.establishmentId, establishmentId),
    })
    if (existingLoyaltyPrograms.length > 0) {
      for (const program of existingLoyaltyPrograms) {
        await db
          .delete(loyaltyPointRules)
          .where(eq(loyaltyPointRules.loyaltyProgramId, program.id))
      }
      console.log("✅ Loyalty point rules removidas")
    }

    // Deletar loyalty programs
    await db
      .delete(loyaltyPrograms)
      .where(eq(loyaltyPrograms.establishmentId, establishmentId))
    console.log("✅ Loyalty programs removidos")

    // Deletar package items relacionados ao estabelecimento
    const existingPackages = await db.query.packages.findMany({
      where: eq(packages.establishmentId, establishmentId),
    })
    if (existingPackages.length > 0) {
      for (const pkg of existingPackages) {
        await db.delete(packageItems).where(eq(packageItems.packageId, pkg.id))
      }
      console.log("✅ Package items removidos")
    }

    // Deletar packages
    await db
      .delete(packages)
      .where(eq(packages.establishmentId, establishmentId))
    console.log("✅ Packages removidos")

    // Deletar categorias
    await db
      .delete(categories)
      .where(eq(categories.establishmentId, establishmentId))
    console.log("✅ Categorias removidas")

    console.log("🎯 Reset concluído! Iniciando inserção de novos dados...")

    // 3. Categories (5-10 items per establishment)
    const categoriesData = []
    const categoryNames = [
      "Cabelos",
      "Unhas",
      "Estética Facial",
      "Massagem",
      "Depilação",
      "Sobrancelhas",
      "Maquiagem",
      "Tratamentos Corporais",
    ]

    for (const establishment of targetEstablishments) {
      for (let i = 0; i < 6; i++) {
        categoriesData.push({
          name: categoryNames[i],
          establishmentId: establishment.id,
        })
      }
    }

    const insertedCategories = await db
      .insert(categories)
      .values(categoriesData)
      .returning()
    console.log(`✅ ${insertedCategories.length} categorias inseridas`)

    // 4. Employees (5-10 items per establishment)
    const employeesData = []
    const employeeNames = [
      "Ana Paula Silva",
      "Bruno Costa",
      "Camila Santos",
      "Diego Oliveira",
      "Fernanda Lima",
      "Gabriel Souza",
      "Helena Rodrigues",
      "Igor Almeida",
    ]

    for (const establishment of targetEstablishments) {
      for (let i = 0; i < 5; i++) {
        employeesData.push({
          establishmentId: establishment.id,
          name: employeeNames[i],
          email: `${employeeNames[i].toLowerCase().replace(/\s+/g, ".")}@${establishment.slug}.com`,
          phone: `(11) 9999${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`,
          biography: `Profissional especializado em beleza com mais de ${Math.floor(Math.random() * 10) + 1} anos de experiência.`,
        })
      }
    }

    const insertedEmployees = await db
      .insert(employees)
      .values(employeesData)
      .returning()
    console.log(`✅ ${insertedEmployees.length} funcionários inseridos`)

    // 5. Services (5-10 items per establishment)
    const servicesData = []
    const servicesByCategory = {
      Cabelos: [
        { name: "Corte Feminino", duration: 60, price: "50.00" },
        { name: "Corte Masculino", duration: 30, price: "35.00" },
        { name: "Escova", duration: 45, price: "40.00" },
        { name: "Coloração", duration: 120, price: "120.00" },
        { name: "Hidratação", duration: 60, price: "60.00" },
      ],
      Unhas: [
        { name: "Manicure", duration: 45, price: "25.00" },
        { name: "Pedicure", duration: 60, price: "30.00" },
        { name: "Esmaltação em Gel", duration: 90, price: "45.00" },
        { name: "Unha Decorada", duration: 120, price: "80.00" },
      ],
      "Estética Facial": [
        { name: "Limpeza de Pele", duration: 90, price: "80.00" },
        { name: "Hidratação Facial", duration: 60, price: "60.00" },
        { name: "Peeling", duration: 75, price: "100.00" },
      ],
      Massagem: [
        { name: "Massagem Relaxante", duration: 60, price: "70.00" },
        { name: "Massagem Modeladora", duration: 90, price: "90.00" },
      ],
    }

    for (const establishment of targetEstablishments) {
      const establishmentCategories = insertedCategories.filter(
        cat => cat.establishmentId === establishment.id
      )

      for (const category of establishmentCategories.slice(0, 4)) {
        const categoryServices = servicesByCategory[
          category.name as keyof typeof servicesByCategory
        ] || [{ name: "Serviço Padrão", duration: 60, price: "50.00" }]

        for (const service of categoryServices) {
          servicesData.push({
            establishmentId: establishment.id,
            name: service.name,
            durationInMinutes: service.duration,
            price: service.price,
            description: `${service.name} realizado por profissionais especializados`,
          })
        }
      }
    }

    const insertedServices = await db
      .insert(services)
      .values(servicesData)
      .returning()
    console.log(`✅ ${insertedServices.length} serviços inseridos`)

    // 6. Service to Categories relationships
    const serviceCategoriesToInsert = []
    for (const service of insertedServices) {
      const establishmentCategories = insertedCategories.filter(
        cat => cat.establishmentId === service.establishmentId
      )

      // Find matching category based on service name
      let matchingCategory = establishmentCategories.find(cat => {
        if (
          service.name.includes("Corte") ||
          service.name.includes("Escova") ||
          service.name.includes("Coloração") ||
          service.name.includes("Hidratação")
        ) {
          return cat.name === "Cabelos"
        }
        if (
          service.name.includes("Manicure") ||
          service.name.includes("Pedicure") ||
          service.name.includes("Unha")
        ) {
          return cat.name === "Unhas"
        }
        if (
          service.name.includes("Limpeza") ||
          service.name.includes("Facial") ||
          service.name.includes("Peeling")
        ) {
          return cat.name === "Estética Facial"
        }
        if (service.name.includes("Massagem")) {
          return cat.name === "Massagem"
        }
        return false
      })

      if (!matchingCategory && establishmentCategories.length > 0) {
        matchingCategory = establishmentCategories[0]
      }

      if (matchingCategory) {
        serviceCategoriesToInsert.push({
          serviceId: service.id,
          categoryId: matchingCategory.id,
        })
      }
    }

    if (serviceCategoriesToInsert.length > 0) {
      await db.insert(serviceCategories).values(serviceCategoriesToInsert)
      console.log(
        `✅ ${serviceCategoriesToInsert.length} relações serviço-categoria inseridas`
      )
    }

    // 6.1. Loyalty Programs (1-2 per establishment)
    const loyaltyProgramsData = []

    for (const establishment of targetEstablishments) {
      const establishmentServices = insertedServices.filter(
        s => s.establishmentId === establishment.id
      )

      if (establishmentServices.length > 0) {
        // Programa 1: Corte gratuito após pontos
        const corteFemininoService = establishmentServices.find(s =>
          s.name.includes("Corte Feminino")
        )
        if (corteFemininoService) {
          loyaltyProgramsData.push({
            establishmentId: establishment.id,
            serviceRewardId: corteFemininoService.id,
            requiredPoints: 100,
            name: "Corte Gratuito",
          })
        }

        // Programa 2: Massagem gratuita após pontos
        const massagemService = establishmentServices.find(s =>
          s.name.includes("Massagem")
        )
        if (massagemService) {
          loyaltyProgramsData.push({
            establishmentId: establishment.id,
            serviceRewardId: massagemService.id,
            requiredPoints: 150,
            name: "Massagem Gratuita",
          })
        }
      }
    }

    let insertedLoyaltyPrograms = []
    if (loyaltyProgramsData.length > 0) {
      insertedLoyaltyPrograms = await db
        .insert(loyaltyPrograms)
        .values(loyaltyProgramsData)
        .returning()
      console.log(
        `✅ ${insertedLoyaltyPrograms.length} programas de fidelidade inseridos`
      )
    }

    // 6.2. Loyalty Point Rules (rules for earning points)
    const loyaltyPointRulesData = []

    for (const program of insertedLoyaltyPrograms) {
      const programServices = insertedServices.filter(
        s => s.establishmentId === program.establishmentId
      )

      // Adicionar apenas 2 serviços por programa
      let selectedServices = []

      if (program.name === "Corte Gratuito") {
        // Para programa de corte: selecionar cortes e coloração
        selectedServices = programServices
          .filter(s => s.name.includes("Corte") || s.name.includes("Coloração"))
          .slice(0, 2)
      } else if (program.name === "Massagem Gratuita") {
        // Para programa de massagem: selecionar massagens e estética facial
        selectedServices = programServices
          .filter(s => s.name.includes("Massagem") || s.name.includes("Facial"))
          .slice(0, 2)
      }

      // Se não encontrou serviços específicos, pega os 2 primeiros
      if (selectedServices.length < 2) {
        selectedServices = programServices.slice(0, 2)
      }

      for (const service of selectedServices) {
        let points = 5 // pontos base

        // Mais pontos para serviços mais caros
        const price = Number.parseFloat(service.price)
        if (price >= 100) points = 15
        else if (price >= 60) points = 10
        else if (price >= 40) points = 8

        loyaltyPointRulesData.push({
          loyaltyProgramId: program.id,
          serviceId: service.id,
          points: points,
        })
      }
    }

    if (loyaltyPointRulesData.length > 0) {
      await db.insert(loyaltyPointRules).values(loyaltyPointRulesData)
      console.log(
        `✅ ${loyaltyPointRulesData.length} regras de pontos de fidelidade inseridas`
      )
    }

    // 6.3. Packages (3-4 per establishment)
    const packagesData = []

    for (const establishment of targetEstablishments) {
      const establishmentServices = insertedServices.filter(
        s => s.establishmentId === establishment.id
      )

      if (establishmentServices.length >= 4) {
        // Pacote 1: Combo Cabelo
        const cabeloServices = establishmentServices.filter(
          s =>
            s.name.includes("Corte") ||
            s.name.includes("Escova") ||
            s.name.includes("Hidratação")
        )
        if (cabeloServices.length >= 2) {
          const totalPrice = cabeloServices
            .slice(0, 3)
            .reduce((sum, s) => sum + Number.parseFloat(s.price), 0)
          packagesData.push({
            establishmentId: establishment.id,
            name: "Combo Cabelo Completo",
            commission: "15.00",
            price: (totalPrice * 0.85).toFixed(2), // 15% desconto
            description: "Pacote completo para cuidados com cabelo",
          })
        }

        // Pacote 2: Combo Unhas
        const unhasServices = establishmentServices.filter(
          s => s.name.includes("Manicure") || s.name.includes("Pedicure")
        )
        if (unhasServices.length >= 2) {
          const totalPrice = unhasServices.reduce(
            (sum, s) => sum + Number.parseFloat(s.price),
            0
          )
          packagesData.push({
            establishmentId: establishment.id,
            name: "Combo Unhas",
            commission: "10.00",
            price: (totalPrice * 0.9).toFixed(2), // 10% desconto
            description: "Pacote completo para cuidados com unhas",
          })
        }

        // Pacote 3: Spa Completo
        const spaServices = establishmentServices.filter(
          s =>
            s.name.includes("Facial") ||
            s.name.includes("Massagem") ||
            s.name.includes("Limpeza")
        )
        if (spaServices.length >= 2) {
          const totalPrice = spaServices
            .slice(0, 2)
            .reduce((sum, s) => sum + Number.parseFloat(s.price), 0)
          packagesData.push({
            establishmentId: establishment.id,
            name: "Spa Day",
            commission: "20.00",
            price: (totalPrice * 0.8).toFixed(2), // 20% desconto
            description: "Dia completo de relaxamento e beleza",
          })
        }
      }
    }

    let insertedPackages = []
    if (packagesData.length > 0) {
      insertedPackages = await db
        .insert(packages)
        .values(packagesData)
        .returning()
      console.log(`✅ ${insertedPackages.length} pacotes inseridos`)
    }

    // 6.4. Package Items (items dentro dos packages)
    const packageItemsData = []

    for (const pkg of insertedPackages) {
      const establishmentServices = insertedServices.filter(
        s => s.establishmentId === pkg.establishmentId
      )

      if (pkg.name.includes("Cabelo")) {
        const cabeloServices = establishmentServices.filter(
          s =>
            s.name.includes("Corte") ||
            s.name.includes("Escova") ||
            s.name.includes("Hidratação")
        )
        for (const service of cabeloServices.slice(0, 3)) {
          packageItemsData.push({
            packageId: pkg.id,
            serviceId: service.id,
            quantity: 1,
          })
        }
      } else if (pkg.name.includes("Unhas")) {
        const unhasServices = establishmentServices.filter(
          s => s.name.includes("Manicure") || s.name.includes("Pedicure")
        )
        for (const service of unhasServices) {
          packageItemsData.push({
            packageId: pkg.id,
            serviceId: service.id,
            quantity: 1,
          })
        }
      } else if (pkg.name.includes("Spa")) {
        const spaServices = establishmentServices.filter(
          s =>
            s.name.includes("Facial") ||
            s.name.includes("Massagem") ||
            s.name.includes("Limpeza")
        )
        for (const service of spaServices.slice(0, 2)) {
          packageItemsData.push({
            packageId: pkg.id,
            serviceId: service.id,
            quantity: 1,
          })
        }
      }
    }

    if (packageItemsData.length > 0) {
      await db.insert(packageItems).values(packageItemsData)
      console.log(`✅ ${packageItemsData.length} itens de pacote inseridos`)
    }

    // 7. Customers (8 customers per establishment)
    const customersData = []
    const customerNames = [
      "Beatriz Alves",
      "Carlos Ferreira",
      "Daniela Rocha",
      "Eduardo Martins",
      "Fabiana Cardoso",
      "Gustavo Pereira",
      "Isabela Nunes",
      "Juliano Barbosa",
    ]

    for (const establishment of targetEstablishments) {
      for (let i = 0; i < 8; i++) {
        const birthDate = new Date()
        birthDate.setFullYear(
          birthDate.getFullYear() - (Math.floor(Math.random() * 50) + 18)
        )

        customersData.push({
          establishmentId: establishment.id,
          name: customerNames[i],
          birthDate,
          phoneNumber: `(11) 9${Math.floor(Math.random() * 100000000)
            .toString()
            .padStart(8, "0")}`,
          email: `${customerNames[i].toLowerCase().replace(/\s+/g, ".")}@email.com`,
          cpf: `${Math.floor(Math.random() * 100000000000)
            .toString()
            .padStart(11, "0")}`,
          city: establishment.name.includes("São Paulo")
            ? "São Paulo"
            : establishment.name.includes("Rio")
              ? "Rio de Janeiro"
              : establishment.name.includes("Belo")
                ? "Belo Horizonte"
                : "Cidade",
          state: establishment.name.includes("São Paulo")
            ? "SP"
            : establishment.name.includes("Rio")
              ? "RJ"
              : establishment.name.includes("Belo")
                ? "MG"
                : "SP",
        })
      }
    }

    const insertedCustomers = await db
      .insert(customers)
      .values(customersData)
      .returning()
    console.log(`✅ ${insertedCustomers.length} clientes inseridos`)

    // 8. Appointments (20 appointments distributed around current date)
    const appointmentsData = []
    const currentDate = new Date("2025-09-15") // Using the current date from env
    const statuses = ["scheduled", "completed", "canceled"] as const
    const paymentTypes = ["pix", "credit_card", "debit_card", "cash"] as const

    for (let i = 0; i < 20; i++) {
      // Distribute appointments from -10 to +10 days around current date
      const daysOffset = i - 10
      const appointmentDate = new Date(currentDate)
      appointmentDate.setDate(appointmentDate.getDate() + daysOffset)

      // Random time between 8:00 and 18:00
      const hour = Math.floor(Math.random() * 10) + 8
      const minute = Math.random() < 0.5 ? 0 : 30

      const startTime = new Date(appointmentDate)
      startTime.setHours(hour, minute, 0, 0)

      // Random establishment, customer, employee, and service
      const randomEstablishment =
        targetEstablishments[
          Math.floor(Math.random() * targetEstablishments.length)
        ]
      const establishmentCustomers = insertedCustomers.filter(
        c => c.establishmentId === randomEstablishment.id
      )
      const establishmentEmployees = insertedEmployees.filter(
        e => e.establishmentId === randomEstablishment.id
      )
      const establishmentServices = insertedServices.filter(
        s => s.establishmentId === randomEstablishment.id
      )

      if (
        establishmentCustomers.length > 0 &&
        establishmentEmployees.length > 0 &&
        establishmentServices.length > 0
      ) {
        const randomCustomer =
          establishmentCustomers[
            Math.floor(Math.random() * establishmentCustomers.length)
          ]
        const randomEmployee =
          establishmentEmployees[
            Math.floor(Math.random() * establishmentEmployees.length)
          ]
        const randomService =
          establishmentServices[
            Math.floor(Math.random() * establishmentServices.length)
          ]

        const endTime = new Date(startTime)
        endTime.setMinutes(
          endTime.getMinutes() + randomService.durationInMinutes
        )

        const status =
          daysOffset < 0
            ? "completed"
            : daysOffset === 0
              ? statuses[Math.floor(Math.random() * 3)]
              : "scheduled"

        appointmentsData.push({
          establishmentId: randomEstablishment.id,
          customerId: randomCustomer.id,
          employeeId: randomEmployee.id,
          serviceId: randomService.id,
          date: appointmentDate.toISOString().split("T")[0],
          startTime,
          endTime,
          status,
          paymentType:
            status === "completed"
              ? (paymentTypes[
                  Math.floor(Math.random() * paymentTypes.length)
                ] as (typeof paymentTypes)[number])
              : null,
          paymentAmount: status === "completed" ? randomService.price : null,
          checkin: status === "completed",
          checkinAt: status === "completed" ? startTime : null,
        })
      }
    }

    const insertedAppointments = await db
      .insert(appointments)
      .values(appointmentsData)
      .returning()
    console.log(`✅ ${insertedAppointments.length} agendamentos inseridos`)

    console.log("🎉 Seed concluído com sucesso!")
    console.log(`
📊 Resumo:
- ${targetEstablishments.length} estabelecimento
- ${insertedCategories.length} categorias
- ${insertedEmployees.length} funcionários
- ${insertedServices.length} serviços
- ${insertedLoyaltyPrograms.length} programas de fidelidade
- ${loyaltyPointRulesData.length} regras de pontos
- ${insertedPackages.length} pacotes
- ${packageItemsData.length} itens de pacote
- ${insertedCustomers.length} clientes
- ${insertedAppointments.length} agendamentos
    `)
  } catch (error) {
    console.error("❌ Erro durante o seed:", error)
    throw error
  }
}

// Execute seed if this file is run directly
if (require.main === module) {
  const establishmentId = process.argv[2] // Pega o primeiro argumento da linha de comando

  if (!establishmentId) {
    console.error("❌ Erro: establishmentId é obrigatório")
    console.log("Uso: npm run db:seed:establishment <establishmentId>")
    process.exit(1)
  }

  console.log(`🎯 Executando seed para estabelecimento: ${establishmentId}`)

  seed(establishmentId)
    .then(() => {
      console.log("Seed executado com sucesso!")
      process.exit(0)
    })
    .catch(error => {
      console.error("Erro no seed:", error)
      process.exit(1)
    })
}

export { seed }
