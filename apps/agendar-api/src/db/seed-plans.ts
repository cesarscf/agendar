import { stripe } from "@/clients/stripe"
import { createPlanOnStripe } from "@/clients/stripe/create-plan"
import { db } from "@/db"
import { plans } from "@/db/schema"

const PLANS_DATA = [
  // Mensais
  {
    name: "Mensal 1",
    description: "Plano mensal para 1 profissional",
    price: 7990, // centavos
    intervalMonth: 1,
    trialPeriodDays: 7,
    minProfessionals: 1,
    maxProfessionals: 1,
  },
  {
    name: "Mensal 2",
    description: "Plano mensal para 2 a 7 profissionais",
    price: 9970,
    intervalMonth: 1,
    trialPeriodDays: 7,
    minProfessionals: 2,
    maxProfessionals: 7,
  },
  {
    name: "Mensal 3",
    description: "Plano mensal para 8 a 15 profissionais",
    price: 16490,
    intervalMonth: 1,
    trialPeriodDays: 7,
    minProfessionals: 8,
    maxProfessionals: 15,
  },
  {
    name: "Mensal 4",
    description: "Plano mensal para mais de 15 profissionais",
    price: 21990,
    intervalMonth: 1,
    trialPeriodDays: 7,
    minProfessionals: 16,
    maxProfessionals: 100,
  },
  // Semestrais (10% desconto)
  {
    name: "Semestral 1",
    description: "Plano semestral para 1 profissional — 10% de desconto",
    price: 7191, // 79.90 * 0.9
    intervalMonth: 6,
    trialPeriodDays: 7,
    minProfessionals: 1,
    maxProfessionals: 1,
  },
  {
    name: "Semestral 2",
    description: "Plano semestral para 2 a 7 profissionais — 10% de desconto",
    price: 8973,
    intervalMonth: 6,
    trialPeriodDays: 7,
    minProfessionals: 2,
    maxProfessionals: 7,
  },
  {
    name: "Semestral 3",
    description: "Plano semestral para 8 a 15 profissionais — 10% de desconto",
    price: 14841,
    intervalMonth: 6,
    trialPeriodDays: 7,
    minProfessionals: 8,
    maxProfessionals: 15,
  },
  {
    name: "Semestral 4",
    description:
      "Plano semestral para mais de 15 profissionais — 10% de desconto",
    price: 19791,
    intervalMonth: 6,
    trialPeriodDays: 7,
    minProfessionals: 16,
    maxProfessionals: 100,
  },
  // Anuais (20% desconto)
  {
    name: "Anual 1",
    description: "Plano anual para 1 profissional — 20% de desconto",
    price: 6392, // 79.90 * 0.8
    intervalMonth: 12,
    trialPeriodDays: 7,
    minProfessionals: 1,
    maxProfessionals: 1,
  },
  {
    name: "Anual 2",
    description: "Plano anual para 2 a 7 profissionais — 20% de desconto",
    price: 7976,
    intervalMonth: 12,
    trialPeriodDays: 7,
    minProfessionals: 2,
    maxProfessionals: 7,
  },
  {
    name: "Anual 3",
    description: "Plano anual para 8 a 15 profissionais — 20% de desconto",
    price: 13192,
    intervalMonth: 12,
    trialPeriodDays: 7,
    minProfessionals: 8,
    maxProfessionals: 15,
  },
  {
    name: "Anual 4",
    description: "Plano anual para mais de 15 profissionais — 20% de desconto",
    price: 17592,
    intervalMonth: 12,
    trialPeriodDays: 7,
    minProfessionals: 16,
    maxProfessionals: 100,
  },
  // Trial Plan (gratuito - sem limite de funcionários)
  {
    name: "Trial Plan",
    description: "PLANO GRATUITO, NÃO PODE SER REMOVIDO",
    price: 0,
    intervalMonth: 1,
    trialPeriodDays: 7,
    minProfessionals: 1,
    maxProfessionals: 9999,
    status: "inactive" as const,
  },
]

async function archiveStripeProducts() {
  console.log("🗑️  Arquivando produtos existentes no Stripe...")

  const products = await stripe.products.list({ limit: 100, active: true })

  for (const product of products.data) {
    try {
      // Primeiro, remover o default_price do produto
      if (product.default_price) {
        await stripe.products.update(product.id, { default_price: "" })
      }

      // Arquivar preços do produto
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
      })

      for (const price of prices.data) {
        await stripe.prices.update(price.id, { active: false })
        console.log(`  ↳ Preço ${price.id} arquivado`)
      }

      // Arquivar produto
      await stripe.products.update(product.id, { active: false })
      console.log(`  ↳ Produto ${product.name} arquivado`)
    } catch (error) {
      console.log(`  ⚠️  Erro ao arquivar ${product.name}:`, error)
    }
  }

  console.log("✅ Produtos arquivados")
}

async function clearPlansTable() {
  console.log("🧹 Limpando tabela de planos...")
  await db.delete(plans)
  console.log("✅ Tabela limpa")
}

async function createPlans() {
  console.log("🚀 Criando novos planos...")

  for (const planData of PLANS_DATA) {
    console.log(`  ↳ Criando ${planData.name}...`)

    // Criar no Stripe (exceto Trial com preço 0)
    let integrationPriceId: string
    let integrationId: string

    if (planData.price === 0) {
      // Para plano gratuito, criar produto sem preço recorrente
      const product = await stripe.products.create({ name: planData.name })
      const price = await stripe.prices.create({
        unit_amount: 0,
        currency: "brl",
        recurring: {
          interval: "month",
          interval_count: 1,
        },
        product: product.id,
      })
      integrationPriceId = price.id
      integrationId = product.id
    } else {
      const { price, product } = await createPlanOnStripe(
        planData.name,
        planData.price,
        planData.intervalMonth,
        planData.trialPeriodDays
      )
      integrationPriceId = price.id
      integrationId = product.id
    }

    // Inserir no banco
    await db.insert(plans).values({
      name: planData.name,
      description: planData.description,
      price: (planData.price / 100).toFixed(2),
      integrationPriceId,
      integrationId,
      intervalMonth: planData.intervalMonth,
      trialPeriodDays: planData.trialPeriodDays,
      minimumProfessionalsIncluded: planData.minProfessionals,
      maximumProfessionalsIncluded: planData.maxProfessionals,
      status: planData.status ?? "active",
    })

    console.log(`    ✅ ${planData.name} criado`)
  }

  console.log("🎉 Todos os planos criados com sucesso!")
}

async function seedPlans() {
  try {
    await archiveStripeProducts()
    await clearPlansTable()
    await createPlans()

    console.log("\n📊 Resumo:")
    console.log(`- ${PLANS_DATA.length} planos criados`)
    console.log("- 4 mensais, 4 semestrais, 4 anuais + 1 trial")
  } catch (error) {
    console.error("❌ Erro:", error)
    throw error
  }
}

// Execute if run directly
seedPlans()
  .then(() => {
    console.log("\n✅ Seed de planos concluído!")
    process.exit(0)
  })
  .catch(error => {
    console.error("Erro no seed:", error)
    process.exit(1)
  })
