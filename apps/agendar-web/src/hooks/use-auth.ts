import { useQuery } from "@tanstack/react-query"
import type {
  EmployeeEstablishment,
  EmployeeProfile,
} from "@/http/employee-self/get-employee-profile"
import { getEmployeeProfile } from "@/http/employee-self/get-employee-profile"
import type { Partner } from "@/http/partner/get-partner"
import { getPartner } from "@/http/partner/get-partner"
import { type UserRole, getRole, getToken } from "@/lib/auth"

export interface UseAuthReturn {
  isAuthenticated: boolean
  partner: Partner | null
  employee: EmployeeProfile | null
  employeeEstablishment: EmployeeEstablishment | null
  role: UserRole | null
  isLoading: boolean
}

export function useAuth(): UseAuthReturn {
  const hasToken = !!getToken()
  const role = getRole()
  const isPartner = role !== "employee"
  const isEmployee = role === "employee"

  const {
    data: partnerData,
    isLoading: partnerLoading,
    isFetching: partnerFetching,
    status: partnerStatus,
  } = useQuery({
    queryKey: ["partner"],
    queryFn: getPartner,
    enabled: hasToken && isPartner,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  const {
    data: employeeData,
    isLoading: employeeLoading,
    isFetching: employeeFetching,
    status: employeeStatus,
  } = useQuery({
    queryKey: ["employee-profile"],
    queryFn: getEmployeeProfile,
    enabled: hasToken && isEmployee,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  const partner = partnerData?.partner ?? null
  const employee = employeeData?.employee ?? null
  const employeeEstablishment =
    employeeData?.establishment ?? null

  const isLoading =
    hasToken &&
    ((isPartner &&
      (partnerLoading ||
        partnerFetching ||
        partnerStatus === "pending")) ||
      (isEmployee &&
        (employeeLoading ||
          employeeFetching ||
          employeeStatus === "pending")))

  const isAuthenticated =
    hasToken && (!!partner || !!employee)

  return {
    isAuthenticated,
    partner,
    employee,
    employeeEstablishment,
    role: hasToken ? role ?? "partner" : null,
    isLoading,
  }
}
