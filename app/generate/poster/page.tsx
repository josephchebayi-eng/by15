"use client"

import { useState } from "react"
import { Palette, Download, RefreshCw, Sparkles, ArrowLeft, FileImage, AlertCircle, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface GenerationResult {
  success: boolean
  imageUrl?: string
  description?: string
  isPlaceholder?: boolean
  provider?: string
  model?: string
  fallbackUsed?: boolean
  message?: string
  error?: string
  details?: string
}

export default function PosterGeneratorPage() {
  const [prompt, setPrompt] = useState("")
  const [posterText, setPosterText] = useState("")
  const [size, setSize] = useState("A4")
  const [style, setStyle] = useState("modern")
  const [colors, setColors] = useState("bold and vibrant")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setResult(null)

    try {
      const response = await fetch("/api/generate/poster", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          size,
          style,
          colors,
          text: posterText,
        }),
      })

      const data = await response.json()
      setResult(data)

      if (!data.success) {
        console.error("Generation failed:", data.error)
      }
    } catch (err) {
      console.error("Request failed:", err)
      setResult({
        success: false,
        error: "Network error occurred while generating the poster",
        details: "Please check your connection and try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!result?.imageUrl) return

    const a = document.createElement("a")
    a.href = result.imageUrl
    a.download = "poster.png"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
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
              <Badge className="bg-green-100 text-green-700">Poster Generator</Badge>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI Poster Generator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create eye-catching posters for events, promotions, and marketing campaigns with AI-powered design.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-black/80 backdrop-blur-xl border border-green-500/40">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-green-600" />
                Design Your Poster
              </CardTitle>
              <CardDescription>
                Describe your poster concept, add text, and customize the design elements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Poster Description</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., A concert poster for a rock band with electric energy and urban vibes"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="bg-gray-900/80 border-green-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="posterText">Text to Include</Label>
                <Textarea
                  id="posterText"
                  placeholder="e.g., ROCK CONCERT 2024, December 15th, City Arena"
                  value={posterText}
                  onChange={(e) => setPosterText(e.target.value)}
                  rows={2}
                  className="bg-gray-900/80 border-green-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger className="bg-gray-900/80 border-green-500/40 text-gray-200 placeholder-gray-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border-green-500/40">
                      <SelectItem value="A4">A4 (210x297mm)</SelectItem>
                      <SelectItem value="A3">A3 (297x420mm)</SelectItem>
                      <SelectItem value="A2">A2 (420x594mm)</SelectItem>
                      <SelectItem value="11x17">Tabloid (11x17 inches)</SelectItem>
                      <SelectItem value="18x24">Medium (18x24 inches)</SelectItem>
                      <SelectItem value="24x36">Large (24x36 inches)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="bg-gray-900/80 border-green-500/40 text-gray-200 placeholder-gray-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border-green-500/40">
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="vintage">Vintage</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="bold">Bold & Dynamic</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="colors">Color Scheme</Label>
                <Input
                  id="colors"
                  placeholder="e.g., bold and vibrant with neon accents"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  className="bg-gray-900/80 border-green-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating Poster...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Poster
                  </>
                )}
              </Button>

              {/* Error Display */}
              {result && !result.success && (
                <Alert className="border-red-500/50 bg-red-50/10">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-200">
                    <div className="font-medium">{result.error}</div>
                    {result.details && <div className="text-sm mt-1 text-red-300">{result.details}</div>}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Message */}
              {result && result.success && result.message && (
                <Alert className="border-green-500/50 bg-green-50/10">
                  <Sparkles className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-200">{result.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Generated Poster Display */}
          <Card className="bg-black/80 backdrop-blur-xl border border-green-500/40">
            <CardHeader>
              <CardTitle>Generated Poster</CardTitle>
              <CardDescription>
                Your AI-generated poster will appear here. Download it when you're happy with the design.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                {result?.imageUrl ? (
                  <img
                    src={result.imageUrl || "/placeholder.svg"}
                    alt="Generated Poster"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Your generated poster will appear here</p>
                  </div>
                )}
              </div>

              {/* Description for placeholder images */}
              {result?.isPlaceholder && result?.description && (
                <Alert className="mt-4 border-blue-500/50 bg-blue-50/10">
                  <Lightbulb className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-200">
                    <div className="font-medium mb-2">AI-Generated Design Description:</div>
                    <div className="text-sm whitespace-pre-wrap">{result.description}</div>
                  </AlertDescription>
                </Alert>
              )}

              {result?.imageUrl && (
                <div className="mt-6 space-y-4">
                  {!result.isPlaceholder && (
                    <Button onClick={handleDownload} className="w-full bg-transparent" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download PNG
                    </Button>
                  )}
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate New Version
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 bg-black/80 backdrop-blur-xl border border-green-500/40">
          <CardHeader>
            <CardTitle>💡 Poster Design Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Hierarchy</h3>
                <p className="text-sm text-gray-600">
                  Organize your text by importance - title, subtitle, details, and contact info.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Visual Impact</h3>
                <p className="text-sm text-gray-600">
                  Use bold colors and striking imagery to grab attention from a distance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Print Quality</h3>
                <p className="text-sm text-gray-600">
                  Choose appropriate sizes and ensure high resolution for professional printing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
