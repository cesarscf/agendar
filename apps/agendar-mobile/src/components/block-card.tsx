import { View, Text, Pressable, Alert } from "react-native"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Trash2 } from "lucide-react-native"
import type {
  EmployeeBlock,
  EmployeeRecurringBlock,
} from "@/lib/validations/blocks"
import { weekdays } from "@/utils"

interface BlockCardProps {
  block: EmployeeBlock
  onDelete: (blockId: string) => void
  isDeleting: boolean
}

export function BlockCard({ block, onDelete, isDeleting }: BlockCardProps) {
  const handleDelete = () => {
    Alert.alert(
      "Excluir Bloqueio",
      "Tem certeza que deseja excluir este bloqueio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => onDelete(block.id),
        },
      ]
    )
  }

  return (
    <View className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-base font-semibold text-gray-900 flex-1">
          {format(new Date(block.startsAt), "dd/MM/yyyy HH:mm", {
            locale: ptBR,
          })}
        </Text>
        <Pressable onPress={handleDelete} disabled={isDeleting} className="p-1">
          <Trash2 size={20} color={isDeleting ? "#D1D5DB" : "#EF4444"} />
        </Pressable>
      </View>

      <Text className="text-sm text-gray-600 mb-2">
        {format(new Date(block.startsAt), "dd/MM/yyyy HH:mm", {
          locale: ptBR,
        })}{" "}
        - {format(new Date(block.endsAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
      </Text>

      <View className="mt-2">
        <Text className="text-xs font-medium text-gray-500 mb-1">Motivo</Text>
        <Text className="text-sm text-gray-900">{block.reason}</Text>
      </View>
    </View>
  )
}

interface RecurringBlockCardProps {
  block: EmployeeRecurringBlock
  onDelete: (blockId: string) => void
  isDeleting: boolean
}

export function RecurringBlockCard({
  block,
  onDelete,
  isDeleting,
}: RecurringBlockCardProps) {
  const handleDelete = () => {
    Alert.alert(
      "Excluir Bloqueio Recorrente",
      "Tem certeza que deseja excluir este bloqueio recorrente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => onDelete(block.id),
        },
      ]
    )
  }

  return (
    <View className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-base font-semibold text-gray-900 flex-1">
          {weekdays[block.weekday]}
        </Text>
        <Pressable onPress={handleDelete} disabled={isDeleting} className="p-1">
          <Trash2 size={20} color={isDeleting ? "#D1D5DB" : "#EF4444"} />
        </Pressable>
      </View>

      <Text className="text-sm text-gray-600 mb-2">
        {block.startTime} - {block.endTime}
      </Text>

      <View className="mt-2">
        <Text className="text-xs font-medium text-gray-500 mb-1">Motivo</Text>
        <Text className="text-sm text-gray-900">{block.reason}</Text>
      </View>
    </View>
  )
}
