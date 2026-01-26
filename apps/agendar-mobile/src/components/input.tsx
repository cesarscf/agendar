import { cn } from "@/utils/cn"
import { TextInput, type TextInputProps } from "react-native"

function Input({ className, placeholderClassName, ...props }: TextInputProps) {
  return (
    <TextInput
      className={cn(
        "web:flex h-16 native:h-16 web:w-full rounded-md border-2 border-gray-300 bg-white text-black px-4 py-5 text-sm lg:text-sm native:text-base native:leading-[1.25] placeholder:text-gray-400 web:ring-offset-white file:border-0 file:bg-transparent file:font-medium focus:border-black web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-black web:focus-visible:ring-offset-2",
        props.editable === false && "opacity-50 web:cursor-not-allowed",
        className
      )}
      placeholderTextColor="#9CA3AF"
      selectionColor="black"
      textAlignVertical="center"
      {...props}
    />
  )
}

export { Input }
