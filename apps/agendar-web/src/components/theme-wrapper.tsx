import "@/styles/themes.css"
import { cn } from "@/lib/utils"

export function ThemeWrapper({
  children,
  theme,
}: Readonly<{
  children: React.ReactNode
  theme: string
}>) {
  return <div className={cn(`theme-${theme}`)}>{children}</div>
}
