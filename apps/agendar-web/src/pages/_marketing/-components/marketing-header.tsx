import { Link } from "@tanstack/react-router"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function MarketingHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-[#1a2b5f] sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/agendar-logo.png"
              alt="Agendar Logo"
              className="h-10 w-auto transition-transform group-hover:scale-105"
            />
            <span className="text-yellow-300 text-xl font-bold">Agendar</span>
          </Link>

          {/* Mobile Menu Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-yellow-300 hover:text-yellow-200 hover:bg-[#2d4a8e]"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[#1a2b5f] border-l border-[#2d4a8e] w-[300px]"
            >
              <SheetHeader className="border-b border-[#2d4a8e] pb-4">
                <SheetTitle className="text-yellow-300 text-xl font-bold">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                <a
                  href="#about"
                  onClick={() => setOpen(false)}
                  className="text-yellow-300 hover:text-yellow-200 hover:bg-[#2d4a8e]/50 transition-all text-base font-medium py-3 px-4 rounded-lg"
                >
                  Sobre nós
                </a>
                <a
                  href="#features"
                  onClick={() => setOpen(false)}
                  className="text-yellow-300 hover:text-yellow-200 hover:bg-[#2d4a8e]/50 transition-all text-base font-medium py-3 px-4 rounded-lg"
                >
                  Funcionalidades
                </a>
                <a
                  href="#pricing"
                  onClick={() => setOpen(false)}
                  className="text-yellow-300 hover:text-yellow-200 hover:bg-[#2d4a8e]/50 transition-all text-base font-medium py-3 px-4 rounded-lg"
                >
                  Preços
                </a>

                <div className="my-2">
                  <Button
                    asChild
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-[#1a2b5f] font-bold px-6 py-3 rounded-full shadow-lg text-base"
                  >
                    <Link to="/pre-register" onClick={() => setOpen(false)}>
                      Teste grátis
                    </Link>
                  </Button>
                </div>

                <a
                  href="#training-videos"
                  onClick={() => setOpen(false)}
                  className="text-yellow-300 hover:text-yellow-200 hover:bg-[#2d4a8e]/50 transition-all text-base font-medium py-3 px-4 rounded-lg"
                >
                  Vídeos de treinamento
                </a>

                <div className="border-t border-[#2d4a8e] mt-4 pt-4">
                  <Link
                    search={{ redirect: undefined }}
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center text-white hover:text-yellow-200 bg-[#2d4a8e] hover:bg-[#3d5a9e] transition-all text-base font-bold py-3 px-4 rounded-lg"
                  >
                    Entrar
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-6">
            <a
              href="#about"
              className="text-yellow-300 hover:text-yellow-200 transition-colors text-sm font-medium"
            >
              Sobre nós
            </a>
            <a
              href="#features"
              className="text-yellow-300 hover:text-yellow-200 transition-colors text-sm font-medium"
            >
              Funcionalidades
            </a>
            <a
              href="#pricing"
              className="text-yellow-300 hover:text-yellow-200 transition-colors text-sm font-medium"
            >
              Preços
            </a>
            <Button
              asChild
              className="bg-yellow-400 hover:bg-yellow-500 text-[#1a2b5f] font-bold px-6 py-2 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              <Link to="/pre-register">Teste grátis</Link>
            </Button>
            <a
              href="#training-videos"
              className="text-yellow-300 hover:text-yellow-200 transition-colors text-sm font-medium"
            >
              Vídeos de treinamento
            </a>
            <Link
              search={{ redirect: undefined }}
              to="/login"
              className="text-white hover:text-yellow-200 transition-colors text-sm font-bold"
            >
              Entrar
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
