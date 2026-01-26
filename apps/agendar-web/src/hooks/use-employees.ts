import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createEmployee } from "@/http/employees/create-employee"
import { createEmployeeBlock } from "@/http/employees/create-employee-block"
import { createEmployeeRecurringBlock } from "@/http/employees/create-employee-recurring-block"
import { deleteEmployee } from "@/http/employees/delete-employee"
import { deleteEmployeeBlock } from "@/http/employees/delete-employee-block"
import { deleteEmployeeRecurringBlock } from "@/http/employees/delete-employee-recurring-block"
import { getEmployee } from "@/http/employees/get-employee"
import { getEmployeeBlocks } from "@/http/employees/get-employee-blocks"
import { getEmployeeRecurringBlocks } from "@/http/employees/get-employee-recurring-blocks"
import { getEmployees } from "@/http/employees/get-employees"
import { updateEmployee } from "@/http/employees/update-employee"
import { updateEmployeeServices } from "@/http/employees/update-employee-services"
import { queryKeys } from "@/lib/query-keys"
import type {
  CreateEmployeeBlockRequest,
  CreateEmployeeRecurringBlockRequest,
} from "@/lib/validations/blocks"
import type {
  UpdateEmployeeRequest,
  UpdateEmployeeServicesForm,
} from "@/lib/validations/employees"

// ========== QUERIES ==========

export function useEmployees() {
  return useQuery({
    queryKey: queryKeys.employees,
    queryFn: getEmployees,
  })
}

export function useEmployee(employeeId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.employee(employeeId),
    queryFn: () => getEmployee(employeeId),
    enabled: enabled && !!employeeId,
  })
}

export function useEmployeeBlocks(employeeId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.employeeBlocks(employeeId),
    queryFn: () => getEmployeeBlocks(employeeId),
    enabled: enabled && !!employeeId,
  })
}

export function useEmployeeRecurringBlocks(employeeId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.employeeRecurringBlocks(employeeId),
    queryFn: () => getEmployeeRecurringBlocks(employeeId),
    enabled: enabled && !!employeeId,
  })
}

// ========== MUTATIONS ==========

export function useCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees })
    },
  })
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateEmployeeRequest) => updateEmployee(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employee(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.employees })
    },
  })
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees })
    },
  })
}

export function useUpdateEmployeeServices() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateEmployeeServicesForm) =>
      updateEmployeeServices(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employee(variables.employeeId),
      })
    },
  })
}

export function useCreateEmployeeBlock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateEmployeeBlockRequest & { employeeId: string }) =>
      createEmployeeBlock(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employeeBlocks(variables.employeeId),
      })
    },
  })
}

export function useDeleteEmployeeBlock(employeeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (blockId: string) => deleteEmployeeBlock(blockId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employeeBlocks(employeeId),
      })
    },
  })
}

export function useCreateEmployeeRecurringBlock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: CreateEmployeeRecurringBlockRequest & { employeeId: string }
    ) => createEmployeeRecurringBlock(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employeeRecurringBlocks(variables.employeeId),
      })
    },
  })
}

export function useDeleteEmployeeRecurringBlock(employeeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (blockId: string) => deleteEmployeeRecurringBlock(blockId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employeeRecurringBlocks(employeeId),
      })
    },
  })
}
