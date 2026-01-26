import React from "react"
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native"
import { X, Check } from "lucide-react-native"
import { useCategories } from "@/hooks/data/category/use-categories"
import type { Category } from "@/lib/validations/category"

const { height: SCREEN_HEIGHT } = Dimensions.get("window")

interface CategorySelectorProps {
  selectedCategoryIds: string[]
  onSelectionChange: (categoryIds: string[]) => void
  error?: string
}

export function CategorySelector({
  selectedCategoryIds,
  onSelectionChange,
  error,
}: CategorySelectorProps) {
  const { data: categories = [], isLoading } = useCategories()
  const [modalVisible, setModalVisible] = React.useState(false)
  const [tempSelectedIds, setTempSelectedIds] = React.useState<string[]>([])

  const handleOpenModal = () => {
    setTempSelectedIds(selectedCategoryIds)
    setModalVisible(true)
  }

  const handleToggleCategory = (categoryId: string) => {
    if (tempSelectedIds.includes(categoryId)) {
      setTempSelectedIds(tempSelectedIds.filter(id => id !== categoryId))
    } else {
      setTempSelectedIds([...tempSelectedIds, categoryId])
    }
  }

  const handleConfirm = () => {
    onSelectionChange(tempSelectedIds)
    setModalVisible(false)
  }

  const handleCancel = () => {
    setTempSelectedIds(selectedCategoryIds)
    setModalVisible(false)
  }

  const handleRemoveCategory = (categoryId: string) => {
    onSelectionChange(selectedCategoryIds.filter(id => id !== categoryId))
  }

  const selectedCategories = selectedCategoryIds
    .map(id => categories.find(cat => cat.id === id))
    .filter(Boolean) as Category[]

  if (isLoading) {
    return (
      <View className="gap-1">
        <Text className="text-sm font-medium text-gray-700">Categorias</Text>
        <Text className="text-sm text-gray-500">Carregando categorias...</Text>
      </View>
    )
  }

  if (categories.length === 0) {
    return (
      <View className="gap-1">
        <Text className="text-sm font-medium text-gray-700">Categorias</Text>
        <Text className="text-sm text-gray-500">
          Nenhuma categoria cadastrada. Cadastre categorias primeiro.
        </Text>
      </View>
    )
  }

  return (
    <View className="gap-1">
      <Text className="text-sm font-medium text-gray-700">Categorias</Text>

      {/* Botão para abrir o modal */}
      <Pressable
        onPress={handleOpenModal}
        className="border border-gray-300 rounded-lg p-4 bg-white"
      >
        <Text className="text-gray-500">
          {selectedCategories.length > 0
            ? `${selectedCategories.length} categoria(s) selecionada(s)`
            : "Selecione as categorias"}
        </Text>
      </Pressable>

      {selectedCategories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-2"
        >
          <View className="flex-row gap-2">
            {selectedCategories.map(category => (
              <View
                key={category.id}
                className="flex-row items-center bg-gray-200 px-3 py-1.5 rounded-full"
              >
                <Text className="text-sm text-gray-700 mr-1">
                  {category.name}
                </Text>
                <Pressable onPress={() => handleRemoveCategory(category.id)}>
                  <X size={16} color="#6B7280" />
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}

      {/* Modal com checkboxes */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCancel}>
          <Pressable
            style={styles.modalContent}
            onPress={e => e.stopPropagation()}
          >
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-center">
                Selecionar Categorias
              </Text>
            </View>

            <ScrollView style={styles.scrollView}>
              {isLoading ? (
                <View className="p-8">
                  <Text className="text-center text-gray-500">
                    Carregando categorias...
                  </Text>
                </View>
              ) : categories.length === 0 ? (
                <View className="p-8">
                  <Text className="text-center text-gray-500">
                    Nenhuma categoria disponível.
                  </Text>
                  <Text className="text-center text-gray-400 text-sm mt-2">
                    Cadastre categorias primeiro para poder selecioná-las.
                  </Text>
                </View>
              ) : (
                categories.map(category => {
                  const isSelected = tempSelectedIds.includes(category.id)
                  return (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => handleToggleCategory(category.id)}
                      className="flex-row items-center justify-between p-4 border-b border-gray-100"
                      activeOpacity={0.7}
                    >
                      <Text className="text-base text-gray-900 flex-1">
                        {category.name}
                      </Text>
                      <View
                        className={`w-6 h-6 rounded border-2 items-center justify-center ${
                          isSelected
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && <Check size={16} color="white" />}
                      </View>
                    </TouchableOpacity>
                  )
                })
              )}
            </ScrollView>

            <View className="p-4 border-t border-gray-200 flex-row gap-3">
              <Pressable
                onPress={handleCancel}
                className="flex-1 p-3 rounded-lg border border-gray-300"
              >
                <Text className="text-center text-gray-700 font-medium">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={handleConfirm}
                className="flex-1 p-3 rounded-lg bg-blue-500"
              >
                <Text className="text-center text-white font-medium">
                  Confirmar ({tempSelectedIds.length})
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.8,
    minHeight: 300,
  },
  scrollView: {
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
})
