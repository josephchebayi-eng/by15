"use client"

import { useState } from "react"
import { Loader2, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function LogoPage() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("")
  const [colors, setColors] = useState("")
  const [industry, setIndustry] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const generateLogo = async () => {
    setLoading(true)
    setError("")
    setImageUrl("")

    try {
      const res = await fetch("/api/generate/logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, colors, industry }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || "Failed to generate image")
      } else {
        setImageUrl(data.imageUrl)
      }
    } catch (err) {
      setError("An error occurred while generating the logo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-blue-500" />
        Generate a Vibrant Logo
      </h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="prompt">Business Description</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g. A creative bakery in Nairobi"
          />
        </div>

        <div>
          <Label htmlFor="style">Style</Label>
          <Input
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="Modern, playful..."
          />
        </div>

        <div>
          <Label htmlFor="colors">Preferred Colors</Label>
          <Input
            id="colors"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="Blue, yellow, pastel tones..."
          />
        </div>

        <div>
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Bakery, fitness, tech..."
          />
        </div>

        <Button onClick={generateLogo} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Generating...
            </>
          ) : (
            "Generate Logo"
          )}
        </Button>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            ⚠️ {error}
          </div>
        )}

        {imageUrl && (
          <div className="mt-6">
            <h3 className="text-sm text-muted-foreground mb-2">Generated Logo Preview</h3>
            <img
              src={imageUrl}
              alt="Generated Logo"
              className="rounded-lg border shadow max-w-full"
            />

            <a
              href={imageUrl}
              download="logo.png"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-3 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Download Logo
            </a>
          </div>
        )}
      </div>

      <div className="mt-10">
        <Badge className="text-sm flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400" />
          AI Powered by DALL·E 3
        </Badge>
      </div>
    </div>
  )
}
