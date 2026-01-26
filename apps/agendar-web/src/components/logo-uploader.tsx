import { Image, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFileUpload } from "@/hooks/use-file-upload"

type Props = {
  value?: File | null
  imageUrl?: string | null
  onChange: (file: File | null) => void
}

export default function LogoUploader({ value, imageUrl, onChange }: Props) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    })

  const file = files[0]?.file

  if (file && file !== value) {
    // @ts-expect-error
    onChange(file)
  }

  const previewUrl =
    files[0]?.preview ||
    (value ? URL.createObjectURL(value) : null) ||
    imageUrl ||
    null

  const isFromUpload = files[0]?.preview || value

  const handleRemove = () => {
    if (files[0]) {
      removeFile(files[0].id)
    }
    onChange(null)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex">
        <Button
          type="button"
          variant="outline"
          className="relative size-24 overflow-hidden p-0 shadow-none"
          onClick={openFileDialog}
          aria-label={previewUrl ? "Change image" : "Upload image"}
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Preview of uploaded"
              width={64}
              height={64}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div aria-hidden="true">
              <Image className="size-4 opacity-60" />
            </div>
          )}
        </Button>

        {previewUrl && isFromUpload && (
          <Button
            type="button"
            onClick={handleRemove}
            size="icon"
            className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
            aria-label="Remove image"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}

        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
        />
      </div>
    </div>
  )
}
