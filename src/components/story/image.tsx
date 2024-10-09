'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

interface ImageLoaderProps {
  prompt: string
  alt: string
}

export default function ImageLoader({ prompt, alt }: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState("");

  const requestGenerateImage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/generate_image`, {
        method: "POST",
        body: JSON.stringify({ prompt })
      })
      if (!response.ok) {
        throw new Error("Failed to generate story cover");
      }
      const data = await response.json();
      setUrl(data.result);
    } catch (error) {
      console.error(error);
      setError(`${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    requestGenerateImage();
  }, [prompt])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted rounded-md">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted rounded-md">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={url}
        alt={alt}
        width={500}
        height={500}
        className="object-cover rounded-md"
      />
    </div>
  )
}