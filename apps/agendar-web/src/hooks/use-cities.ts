import { useQuery } from "@tanstack/react-query"

type IBGECity = {
  id: number
  nome: string
}

async function fetchCities(uf: string): Promise<string[]> {
  const response = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
  )

  if (!response.ok) {
    throw new Error("Erro ao buscar cidades")
  }

  const cities: IBGECity[] = await response.json()
  return cities.map(city => city.nome).sort((a, b) => a.localeCompare(b))
}

export function useCities(uf: string | undefined) {
  return useQuery({
    queryKey: ["ibge-cities", uf],
    queryFn: () => fetchCities(uf!),
    enabled: !!uf,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - cities don't change often
  })
}
