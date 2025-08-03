"use client"

import { useState } from "react"
import { Palette, Download, RefreshCw, Sparkles, ArrowLeft, FileImage, AlertCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export default function LogoGeneratorPage() {
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
    } catch {
      setError("An error occurred while generating the logo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Header */}
      <header className="border-b border-emerald-500/30 bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  BrandCraft
                </span>
              </Link>
              <Badge className="bg-blue-100 text-blue-700">Logo Generator</Badge>
            </div>
            <Link href="/dashboard">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">AI Logo Generator</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Craft unique and professional brand logos with AI. Describe your brand and let the magic happen.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-lime-glass-200 backdrop-blur-xl border border-lime-500/30 shadow-glass-lime">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                Describe Your Brand
              </CardTitle>
              <CardDescription>
                Tell us about your business and the vibe you want for your logo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Business Description</Label>
                <Textarea
                  id="prompt"
                  placeholder="E.g. A creative bakery in Nairobi"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="bg-gray-900/80 border-blue-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Input
                  id="style"
                  placeholder="Modern, playful, minimalist..."
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="bg-gray-900/80 border-blue-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="colors">Preferred Colors</Label>
                <Input
                  id="colors"
                  placeholder="E.g. Blue, yellow, pastel tones..."
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  className="bg-gray-900/80 border-blue-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="E.g. Bakery, fitness, tech..."
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="bg-gray-900/80 border-blue-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <Button
                onClick={generateLogo}
                disabled={!prompt.trim() || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating Logo...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Logo
                  </>
                )}
              </Button>

              {error && (
                <Alert className="border-red-500/50 bg-red-50/10">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Logo Preview */}
          <Card className="bg-lime-glass-200 backdrop-blur-xl border border-lime-500/30 shadow-glass-lime">
            <CardHeader>
              <CardTitle>Logo Preview</CardTitle>
              <CardDescription>
                Your AI-generated logo will appear here. You can download it or generate another.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Generated Logo"
                    width={512}
                    height={512}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Your generated logo will appear here</p>
                  </div>
                )}
              </div>

              {imageUrl && (
                <div className="mt-6 space-y-4">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-blue-500/40 text-blue-400 hover:bg-blue-500/20"
                  >
                  <a
                    href={imageUrl}
                    download="logo.png"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Logo
                  </a>
                  </Button>
                  <Button
                    onClick={generateLogo}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate New Version
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <Badge className="text-sm flex items-center gap-1 bg-yellow-100 text-yellow-800">
            <Star className="w-4 h-4 text-yellow-500" />
            AI Powered by DALL·E 3
          </Badge>
        </div>
      </div>
    </div>
  )
}
