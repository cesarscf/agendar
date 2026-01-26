import { useQuery } from "@tanstack/react-query"

import { getEstablishment } from "@/http/establishment/get-establishment"
import type { Establishment } from "@/lib/validations/establishment"

export function useEstablishment() {
  return useQuery<Establishment, string>({
    queryKey: ["establishment"],

    queryFn: async () => {
      const { data, error } = await getEstablishment()

      if (error) {
        throw error
      }

      return data!
    },
  })
}
