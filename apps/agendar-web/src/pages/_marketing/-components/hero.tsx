import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="bg-[#1a2b5f] relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-[#1a2b5f] via-[#2d4a8e] to-[#1e3a7a]" />

      <div className="relative z-10">
        <main className="flex flex-col lg:grid lg:grid-cols-[auto_1fr] lg:gap-0 py-4 lg:py-0">
          {/* Left Side - Image */}
          <div className="order-last lg:order-1 px-4 lg:px-0 mt-3 lg:mt-0 flex justify-center lg:block">
            <div className="relative w-full max-w-[280px] lg:max-w-none">
              <img
                src="/hero-img.png"
                alt="Profissional apresentando o app Agendar"
                className="w-full h-auto object-cover drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="order-first lg:order-2 flex flex-col justify-start lg:pt-12 px-4 lg:px-12 xl:px-20 space-y-3 lg:space-y-6 text-center lg:text-left items-center lg:items-start">
            {/* Mobile: Agendar at top */}
            <div className="lg:hidden w-full flex justify-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-none">
                Agendar
              </h1>
            </div>

            {/* Mobile: Chart with Titles */}
            <div className="flex items-center gap-3 lg:hidden w-full justify-center">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full drop-shadow-xl"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="35"
                    strokeDasharray="183 439"
                    transform="rotate(-90 100 100)"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="35"
                    strokeDasharray="146 439"
                    strokeDashoffset="-183"
                    transform="rotate(-90 100 100)"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="35"
                    strokeDasharray="73 439"
                    strokeDashoffset="-329"
                    transform="rotate(-90 100 100)"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="35"
                    strokeDasharray="37 439"
                    strokeDashoffset="-402"
                    transform="rotate(-90 100 100)"
                  />
                  <circle cx="100" cy="100" r="45" fill="#1a2b5f" />
                </svg>
              </div>
              <div className="space-y-0">
                <h2 className="text-2xl md:text-4xl font-extrabold text-[#7dd3fc] leading-none">
                  Agendamento
                </h2>
                <h2 className="text-2xl md:text-4xl font-extrabold text-yellow-400 leading-none">
                  Inteligente
                </h2>
                <h2 className="text-2xl md:text-4xl font-extrabold text-[#7dd3fc] leading-none">
                  Gestão
                </h2>
                <h2 className="text-2xl md:text-4xl font-extrabold text-yellow-400 leading-none">
                  Eficiente
                </h2>
              </div>
            </div>

            {/* Desktop: Titles and Chart */}
            <div className="hidden lg:flex lg:flex-row lg:items-start lg:gap-8 xl:gap-12 w-full">
              <div className="space-y-0 lg:space-y-1">
                <h1 className="text-7xl xl:text-8xl font-extrabold text-white leading-none">
                  Agendar
                </h1>
                <h2 className="text-6xl xl:text-7xl font-extrabold text-[#7dd3fc] leading-none">
                  Agendamento
                </h2>
                <h2 className="text-6xl xl:text-7xl font-extrabold text-yellow-400 leading-none">
                  Inteligente
                </h2>
                <h2 className="text-6xl xl:text-7xl font-extrabold text-[#7dd3fc] leading-none">
                  Gestão
                </h2>
                <h2 className="text-6xl xl:text-7xl font-extrabold text-yellow-400 leading-none">
                  Eficiente
                </h2>
              </div>

              {/* Chart Desktop */}
              <div className="flex justify-start flex-shrink-0">
                <div className="relative w-56 h-56 xl:w-64 xl:h-64">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full drop-shadow-xl"
                  >
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="35"
                      strokeDasharray="183 439"
                      transform="rotate(-90 100 100)"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="35"
                      strokeDasharray="146 439"
                      strokeDashoffset="-183"
                      transform="rotate(-90 100 100)"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="35"
                      strokeDasharray="73 439"
                      strokeDashoffset="-329"
                      transform="rotate(-90 100 100)"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="35"
                      strokeDasharray="37 439"
                      strokeDashoffset="-402"
                      transform="rotate(-90 100 100)"
                    />
                    <circle cx="100" cy="100" r="45" fill="#1a2b5f" />
                  </svg>

                  <div className="absolute right-0 top-12 text-xs text-white font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-md" />
                      <div className="leading-tight">
                        <div className="text-white/90">Serviço 1</div>
                        <div className="text-cyan-300 font-bold">41.7%</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute right-0 bottom-12 text-xs text-white font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full shadow-md" />
                      <div className="leading-tight">
                        <div className="text-white/90">Serviço 4</div>
                        <div className="text-purple-300 font-bold">33.3%</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-0 bottom-20 text-xs text-white font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-pink-500 rounded-full shadow-md" />
                      <div className="leading-tight">
                        <div className="text-white/90">Serviço 2</div>
                        <div className="text-pink-300 font-bold">16.7%</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-0 bottom-6 text-xs text-white font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-md" />
                      <div className="leading-tight">
                        <div className="text-white/90">Serviço 3</div>
                        <div className="text-yellow-300 font-bold">8.3%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Veja nossos planos button */}
            <div className="w-full flex justify-center lg:justify-start">
              <Button
                asChild
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 h-auto px-6 py-3 lg:px-10 lg:py-5 rounded-xl lg:rounded-2xl text-sm lg:text-xl font-bold shadow-xl transition-all hover:shadow-2xl hover:scale-105"
              >
                <a href="#planos" className="flex items-center justify-center">
                  Veja nossos planos
                </a>
              </Button>
            </div>

            {/* Download Section */}
            <div className="space-y-1.5 lg:space-y-2 w-full flex flex-col items-center lg:items-start">
              <p className="text-white text-[10px] lg:text-sm font-bold tracking-[0.2em] uppercase">
                Baixe o Aplicativo
              </p>

              <div className="flex flex-col sm:flex-row gap-1.5 lg:gap-2 w-full sm:w-auto">
                <Button
                  asChild
                  className="bg-white hover:bg-gray-50 text-gray-900 h-auto px-3 py-1.5 lg:px-5 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold shadow-xl transition-all hover:shadow-2xl hover:scale-105 sm:w-auto lg:w-[170px]"
                >
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 lg:gap-2"
                  >
                    <svg
                      className="w-4 h-4 lg:w-6 lg:h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-[8px] lg:text-[9px] uppercase tracking-wide text-gray-600">
                        Obtenha no
                      </div>
                      <div className="text-xs lg:text-base font-bold leading-tight">
                        Google Play
                      </div>
                    </div>
                  </a>
                </Button>

                <Button
                  asChild
                  className="bg-white hover:bg-gray-50 text-gray-900 h-auto px-3 py-1.5 lg:px-5 lg:py-3 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold shadow-xl transition-all hover:shadow-2xl hover:scale-105 sm:w-auto lg:w-[170px]"
                >
                  <a
                    href="https://www.apple.com/app-store/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 lg:gap-2"
                  >
                    <svg
                      className="w-4 h-4 lg:w-6 lg:h-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-[8px] lg:text-[9px] uppercase tracking-wide text-gray-600">
                        Baixar na
                      </div>
                      <div className="text-xs lg:text-base font-bold leading-tight">
                        App Store
                      </div>
                    </div>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  )
}
