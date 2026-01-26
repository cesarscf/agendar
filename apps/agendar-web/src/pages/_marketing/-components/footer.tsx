import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-[#0a1628] mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Sobre */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#F4C430]">Agendar</h3>
            <p className="text-sm text-gray-300">
              A solução completa para gerenciar agendamentos do seu negócio de
              forma simples e eficiente.
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#F4C430]">
              Links Rápidos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-[#F4C430] transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-300 hover:text-[#F4C430] transition-colors"
                >
                  Sobre Nós
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-300 hover:text-[#F4C430] transition-colors"
                >
                  Funcionalidades
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-gray-300 hover:text-[#F4C430] transition-colors"
                >
                  Planos
                </a>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#F4C430]">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#faq"
                  className="text-gray-300 hover:text-[#F4C430] transition-colors"
                >
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <Link
                  to="/login"
                  search={{ redirect: undefined }}
                  className="text-gray-300 hover:text-[#F4C430] transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#F4C430]">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4" />
                contato@agendar.com
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4" />
                (11) 9999-9999
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                São Paulo, Brasil
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Agendar. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
