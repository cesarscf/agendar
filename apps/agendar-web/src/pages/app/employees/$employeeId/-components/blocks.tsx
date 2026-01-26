import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash } from "lucide-react"
import { useQueryState } from "nuqs"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { deleteEmployeeBlock } from "@/http/employees/delete-employee-block"
import { deleteEmployeeRecurringBlock } from "@/http/employees/delete-employee-recurring-block"
import { getEmployeeBlocks } from "@/http/employees/get-employee-blocks"
import { getEmployeeRecurringBlocks } from "@/http/employees/get-employee-recurring-blocks"
import { formatDate, weekdays } from "@/lib/utils"
import { CreateEmployeeBlock } from "./create-employee-block"
import { CreateEmployeeRecurringBlock } from "./create-employee-recurring-block"

export function EmployeeBlocks({ employeeId }: { employeeId: string }) {
  const queryClient = useQueryClient()
  const [showCreateBlock, setShowCreateBlock] = React.useState(false)
  const [showCreateReccuringBlock, setShowCreateReccuringBlock] =
    React.useState(false)
  const [blockType, setBlockType] = useQueryState("type", {
    defaultValue: "blocks",
  })

  const { data: blocks } = useQuery({
    queryKey: ["employee", employeeId, "blocks"],
    queryFn: () => getEmployeeBlocks(employeeId),
  })

  const { data: recurringBlocks } = useQuery({
    queryKey: ["employee", employeeId, "recurring-blocks"],
    queryFn: () => getEmployeeRecurringBlocks(employeeId),
  })

  const {
    mutateAsync: deleteEmployeeRecurringBlockMutate,
    isPending: deleteEmployeeRecurringBlockIsPending,
  } = useMutation({
    mutationFn: deleteEmployeeRecurringBlock,
  })

  const {
    mutateAsync: deleteEmployeeBlockMutate,
    isPending: deleteEmployeeBlockIsPending,
  } = useMutation({
    mutationFn: deleteEmployeeBlock,
  })

  return (
    <Tabs
      value={blockType || "blocks"}
      onValueChange={value => {
        setBlockType(value)
      }}
      className="w-full"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-auto">
          <TabsTrigger value="blocks">Bloqueios Pontuais</TabsTrigger>
          <TabsTrigger value="recurring-blocks">
            Bloqueios Recorrentes
          </TabsTrigger>
        </TabsList>
        {blockType === "blocks" && (
          <Dialog open={showCreateBlock} onOpenChange={setShowCreateBlock}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="mt-4 w-full md:ml-4 md:mt-0 md:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" /> Adicionar Bloqueio Pontual
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Bloqueio Pontual</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes para adicionar um novo bloqueio pontual.
                </DialogDescription>
              </DialogHeader>
              <CreateEmployeeBlock
                employeeId={employeeId}
                onSuccess={() => {
                  setShowCreateBlock(false)
                }}
              />
            </DialogContent>
          </Dialog>
        )}
        {blockType === "recurring-blocks" && (
          <Dialog
            open={showCreateReccuringBlock}
            onOpenChange={setShowCreateReccuringBlock}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="mt-4 w-full md:ml-4 md:mt-0 md:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" /> Adicionar Bloqueio Recorrente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Bloqueio Recorrente</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes para adicionar um novo bloqueio
                  recorrente.
                </DialogDescription>
              </DialogHeader>
              <CreateEmployeeRecurringBlock
                employeeId={employeeId}
                onSuccess={() => {
                  setShowCreateReccuringBlock(false)
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <TabsContent value="blocks" className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blocks?.map(block => (
            <Card key={block.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {formatDate(block.startsAt, "dd/MM/yyyy HH:mm")}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={deleteEmployeeBlockIsPending}
                  onClick={async () => {
                    if (
                      confirm("Tem certeza que deseja excluir este bloqueio?")
                    ) {
                      await deleteEmployeeBlockMutate(block.id)
                      queryClient.invalidateQueries({
                        queryKey: ["employee", employeeId, "blocks"],
                      })
                    }
                  }}
                  aria-label={`Excluir bloco para ${block.reason}`}
                >
                  <Trash className="h-5 w-5 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {formatDate(block.startsAt, "dd/MM/yyyy HH:mm")} -{" "}
                  {formatDate(block.endsAt, "dd/MM/yyyy HH:mm")}
                </p>
                <div className="grid gap-1 mt-2">
                  <Label className="text-xs text-muted-foreground">
                    Motivo
                  </Label>
                  <p className="text-base">{block.reason}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="recurring-blocks" className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recurringBlocks?.map(block => (
            <Card key={block.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {weekdays[block.weekday]}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={deleteEmployeeRecurringBlockIsPending}
                  onClick={async () => {
                    if (
                      confirm(
                        "Tem certeza que deseja excluir este bloqueio recorrente?"
                      )
                    ) {
                      await deleteEmployeeRecurringBlockMutate(block.id)
                      queryClient.invalidateQueries({
                        queryKey: ["employee", employeeId, "recurring-blocks"],
                      })
                    }
                  }}
                  aria-label={`Excluir bloco recorrente para ${block.reason} em ${weekdays[block.weekday]}`}
                >
                  <Trash className="h-5 w-5 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {block.startTime} - {block.endTime}
                </p>
                <div className="grid gap-1 mt-2">
                  <Label className="text-xs text-muted-foreground">
                    Motivo
                  </Label>
                  <p className="text-base">{block.reason}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
