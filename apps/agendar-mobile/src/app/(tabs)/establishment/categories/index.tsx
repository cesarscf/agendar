import { useCategories } from "@/hooks/data/category/use-categories"
import { Link } from "expo-router"
import { ChevronRight, FolderOpen } from "lucide-react-native"
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native"
import { Empty } from "@/components/empty"

export default function Categories() {
  const { data: categories, isLoading } = useCategories()

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Empty
          message="Nenhuma categoria cadastrada"
          icon={<FolderOpen size={48} color="#9CA3AF" />}
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="mt-4 px-4">
          {categories?.map(category => (
            <Link
              href={`/(tabs)/establishment/categories/${category.id}`}
              key={category.id}
              asChild
            >
              <Pressable
                className="flex-row items-center justify-between p-4 border-b border-gray-200"
                android_ripple={{ color: "#ddd" }}
              >
                <Text className="text-base text-gray-900">{category.name}</Text>
                <ChevronRight size={24} className="text-gray-400" />
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
