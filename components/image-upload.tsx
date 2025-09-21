"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Camera, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onImagesUploaded: (imageUrls: string[]) => void
}

export function ImageUpload({ onImagesUploaded }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    const imageUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file)
      imageUrls.push(previewUrl)

      // Here you would typically upload to your storage service
      // For now, we'll just use the preview URL
    }

    setImages(prev => [...prev, ...imageUrls])
    onImagesUploaded([...images, ...imageUrls])
    setUploading(false)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesUploaded(newImages)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={openFileDialog}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload from Gallery
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={openFileDialog}
                disabled={uploading}
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Picture
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              AI will automatically enhance and optimize your image
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative rounded-lg overflow-hidden border">
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={openFileDialog}
            disabled={uploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Add More Images
          </Button>
        </div>
      )}

      {uploading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Uploading images...</p>
        </div>
      )}
    </div>
  )
}