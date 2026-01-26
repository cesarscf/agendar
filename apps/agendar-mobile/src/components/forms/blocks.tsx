import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native"
import { useEmployeeBlocks } from "@/hooks/data/employees/use-employee-blocks"
import { useEmployeeRecurringBlocks } from "@/hooks/data/employees/use-employee-recurring-blocks"
import { useDeleteEmployeeBlock } from "@/hooks/data/employees/use-delete-employee-block"
import { useDeleteEmployeeRecurringBlock } from "@/hooks/data/employees/use-delete-employee-recurring-block"
import { cn } from "@/utils/cn"
import { BlockCard, RecurringBlockCard } from "@/components/block-card"
import { CreateEmployeeBlockForm } from "@/components/forms/create-employee-block-form"
import { CreateEmployeeRecurringBlockForm } from "@/components/forms/create-employee-recurring-block-form"
import { AppButton } from "@/components/button"
import { Empty } from "@/components/empty"
import { CalendarOff } from "lucide-react-native"

interface EmployeeBlocksTabProps {
  employeeId: string
}

export function EmployeeBlocksTab({ employeeId }: EmployeeBlocksTabProps) {
  const [activeTab, setActiveTab] = useState<"blocks" | "recurring-blocks">(
    "blocks"
  )
  const [showCreateBlockModal, setShowCreateBlockModal] = useState(false)
  const [showCreateRecurringBlockModal, setShowCreateRecurringBlockModal] =
    useState(false)

  const { data: blocks, isLoading: isLoadingBlocks } =
    useEmployeeBlocks(employeeId)
  const { data: recurringBlocks, isLoading: isLoadingRecurringBlocks } =
    useEmployeeRecurringBlocks(employeeId)

  const { mutateAsync: deleteBlock, isPending: isDeletingBlock } =
    useDeleteEmployeeBlock()
  const {
    mutateAsync: deleteRecurringBlock,
    isPending: isDeletingRecurringBlock,
  } = useDeleteEmployeeRecurringBlock()

  const handleDeleteBlock = async (blockId: string) => {
    await deleteBlock({ blockId, employeeId })
  }

  const handleDeleteRecurringBlock = async (recurringBlockId: string) => {
    await deleteRecurringBlock({ recurringBlockId, employeeId })
  }

  const handleCreateBlockSuccess = () => {
    setShowCreateBlockModal(false)
  }

  const handleCreateRecurringBlockSuccess = () => {
    setShowCreateRecurringBlockModal(false)
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row p-2">
          <Pressable
            onPress={() => setActiveTab("blocks")}
            className={cn(
              "flex-1 py-3 rounded-lg mx-1",
              activeTab === "blocks" ? "bg-[#fbdd65]" : "bg-gray-100"
            )}
          >
            <Text
              className={cn(
                "text-center font-semibold",
                activeTab === "blocks" ? "text-black" : "text-gray-600"
              )}
            >
              Bloqueios Pontuais
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("recurring-blocks")}
            className={cn(
              "flex-1 py-3 rounded-lg mx-1",
              activeTab === "recurring-blocks" ? "bg-[#fbdd65]" : "bg-gray-100"
            )}
          >
            <Text
              className={cn(
                "text-center font-semibold",
                activeTab === "recurring-blocks"
                  ? "text-black"
                  : "text-gray-600"
              )}
            >
              Bloqueios Recorrentes
            </Text>
          </Pressable>
        </View>

        <View className="p-4">
          {activeTab === "blocks" && (
            <AppButton
              title="Adicionar Bloqueio Pontual"
              onPress={() => setShowCreateBlockModal(true)}
              theme="primary"
            />
          )}
          {activeTab === "recurring-blocks" && (
            <AppButton
              title="Adicionar Bloqueio Recorrente"
              onPress={() => setShowCreateRecurringBlockModal(true)}
              theme="primary"
            />
          )}
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {activeTab === "blocks" && (
          <>
            {isLoadingBlocks && (
              <View className="py-10">
                <ActivityIndicator size="large" />
              </View>
            )}

            {!isLoadingBlocks && blocks && blocks.length === 0 && (
              <Empty
                message="Nenhum bloqueio pontual cadastrado"
                icon={<CalendarOff size={48} color="#9CA3AF" />}
              />
            )}

            {!isLoadingBlocks &&
              blocks?.map(block => (
                <BlockCard
                  key={block.id}
                  block={block}
                  onDelete={handleDeleteBlock}
                  isDeleting={isDeletingBlock}
                />
              ))}
          </>
        )}

        {activeTab === "recurring-blocks" && (
          <>
            {isLoadingRecurringBlocks && (
              <View className="py-10">
                <ActivityIndicator size="large" />
              </View>
            )}

            {!isLoadingRecurringBlocks &&
              recurringBlocks &&
              recurringBlocks.length === 0 && (
                <Empty
                  message="Nenhum bloqueio recorrente cadastrado"
                  icon={<CalendarOff size={48} color="#9CA3AF" />}
                />
              )}

            {!isLoadingRecurringBlocks &&
              recurringBlocks?.map(block => (
                <RecurringBlockCard
                  key={block.id}
                  block={block}
                  onDelete={handleDeleteRecurringBlock}
                  isDeleting={isDeletingRecurringBlock}
                />
              ))}
          </>
        )}
      </ScrollView>

      <Modal
        visible={showCreateBlockModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateBlockModal(false)}
      >
        <View className="flex-1">
          <View className="bg-white border-b border-gray-200 p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold">
                Adicionar Bloqueio Pontual
              </Text>
              <Pressable onPress={() => setShowCreateBlockModal(false)}>
                <Text className="text-base text-gray-600">Fechar</Text>
              </Pressable>
            </View>
          </View>
          <CreateEmployeeBlockForm
            employeeId={employeeId}
            onSuccess={handleCreateBlockSuccess}
          />
        </View>
      </Modal>

      <Modal
        visible={showCreateRecurringBlockModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateRecurringBlockModal(false)}
      >
        <View className="flex-1">
          <View className="bg-white border-b border-gray-200 p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold">
                Adicionar Bloqueio Recorrente
              </Text>
              <Pressable
                onPress={() => setShowCreateRecurringBlockModal(false)}
              >
                <Text className="text-base text-gray-600">Fechar</Text>
              </Pressable>
            </View>
          </View>
          <CreateEmployeeRecurringBlockForm
            employeeId={employeeId}
            onSuccess={handleCreateRecurringBlockSuccess}
          />
        </View>
      </Modal>
    </View>
  )
}
