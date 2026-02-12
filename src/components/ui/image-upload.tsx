"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePlus, Loader2, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        onChange(data.url)
      } else {
        console.error("Upload failed:", data.message)
        // Optionally toast error here
      }
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
          fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="flex flex-col gap-4">
      {value ? (
        <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden border">
           <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-10 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="relative w-full h-full"> 
               {/* 
                 Next/Image requires width/height or fill. 
                 Since we allow any domain, we configured next.config.ts.
                 For local uploads, it works fine.
               */}
               <img 
                 src={value} 
                 alt="Uploaded Image" 
                 className="object-cover w-full h-full"
               />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
           <Button
            type="button"
            variant="secondary"
            disabled={disabled || isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full md:w-auto"
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="mr-2 h-4 w-4" />
            )}
            Upload Image
          </Button>
        </div>
      )}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
       {/* Fallback text input if needed, or just hidden input for form state */}
       <Input 
         value={value} 
         onChange={(e) => onChange(e.target.value)} 
         placeholder="Or enter Image URL" 
         disabled={disabled}
         className={value ? "hidden" : "block"}
       />
    </div>
  )
}
