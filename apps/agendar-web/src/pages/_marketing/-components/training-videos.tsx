import { Check } from "lucide-react"

interface Video {
  title: string
  videoId: string // YouTube video ID
}

const videos: Video[] = [
  {
    title: "Instalando o Agendar",
    videoId: "dQw4w9WgXcQ", // Mock YouTube video ID
  },
  {
    title: "Configurando sua loja",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Configurando categorias",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Configurando serviços",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Configurando profissionais",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Configurando pacote de serviços",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Configurando fidelidade",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Configurando clientes",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Configurando Profissionais",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Fazendo agendamento",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Relatórios gerenciais",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Agenda e check-in",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Fidelização de clientes",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Venda recorrente",
    videoId: "dQw4w9WgXcQ",
  },
  {
    title: "Fila de espera nunca mais",
    videoId: "dQw4w9WgXcQ",
  },
]

export function TrainingVideos() {
  return (
    <section className="py-20 px-4 bg-[#1e3a8a]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
          Vídeos de treinamento
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {videos.map((video, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <h3 className="text-white font-medium text-sm leading-tight">
                  {video.title}
                </h3>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800 hover:scale-105 transition-transform cursor-pointer">
                <img
                  src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
