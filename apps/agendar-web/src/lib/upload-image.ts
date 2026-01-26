import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage"
import { storage } from "./firebase"

/**
 * Extrai o path do arquivo a partir da URL do Firebase Storage
 */
function getPathFromUrl(url: string): string | null {
  try {
    const decodedUrl = decodeURIComponent(url)
    const match = decodedUrl.match(/\/o\/(.+?)\?/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

/**
 * Faz upload de uma imagem para o Firebase Storage
 * @param file - Arquivo a ser enviado
 * @param oldImageUrl - URL da imagem anterior (opcional). Se fornecida, a imagem antiga será deletada
 * @returns URL da nova imagem
 */
export async function uploadImage(
  file: File,
  oldImageUrl?: string | null
): Promise<string> {
  // Upload da nova imagem
  const fileRef = ref(storage, `images/${Date.now()}-${file.name}`)
  await uploadBytes(fileRef, file)
  const url = await getDownloadURL(fileRef)

  // Deletar imagem antiga se existir
  if (oldImageUrl) {
    try {
      const oldPath = getPathFromUrl(oldImageUrl)
      if (oldPath) {
        const oldFileRef = ref(storage, oldPath)
        await deleteObject(oldFileRef)
      }
    } catch (error) {
      console.error("Erro ao deletar imagem antiga:", error)
      // Não interrompe o fluxo se falhar ao deletar
    }
  }

  return url
}
