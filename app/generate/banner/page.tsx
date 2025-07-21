"use client"

import { useState } from "react"
import { Palette, Download, RefreshCw, Sparkles, ArrowLeft, Target, Info, AlertTriangle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function BannerGeneratorPage() {
  const [prompt, setPrompt] = useState("")
  const [dimensions, setDimensions] = useState("1920x1080")
  const [style, setStyle] = useState("modern")
  const [colors, setColors] = useState("blue and white")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBanner, setGeneratedBanner] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<"general" | "quota" | "config" | null>(null)
  const [generationInfo, setGenerationInfo] = useState<{
    provider: string
    fallbackUsed: boolean
    promptEnhanced: boolean
    message?: string
  } | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)
    setErrorType(null)
    setGenerationInfo(null)

    try {
      const response = await fetch("/api/generate/banner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          dimensions,
          style,
          colors,
          enhancePrompt: true,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedBanner(data.imageUrl)
        setGenerationInfo({
          provider: data.provider,
          fallbackUsed: data.fallbackUsed || false,
          promptEnhanced: data.promptEnhanced || false,
          message: data.message,
        })
      } else {
        setError(data.error || "Failed to generate banner")

        // Set error type for better UI handling
        if (data.needsConfiguration) {
          setErrorType("config")
        } else if (data.quotaExceeded) {
          setErrorType("quota")
        } else {
          setErrorType("general")
        }
      }
    } catch (err) {
      console.error("Generation request failed:", err)
      setError("Network error occurred. Please check your connection and try again.")
      setErrorType("general")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedBanner) return

    const a = document.createElement("a")
    a.href = generatedBanner
    a.download = "banner.png"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const renderError = () => {
    if (!error) return null

    const getErrorIcon = () => {
      switch (errorType) {
        case "quota":
          return <AlertTriangle className="h-4 w-4 text-orange-600" />
        case "config":
          return <Settings className="h-4 w-4 text-blue-600" />
        default:
          return <AlertTriangle className="h-4 w-4 text-red-600" />
      }
    }

    const getErrorClass = () => {
      switch (errorType) {
        case "quota":
          return "bg-orange-50 border-orange-200"
        case "config":
          return "bg-blue-50 border-blue-200"
        default:
          return "bg-red-50 border-red-200"
      }
    }

    const getErrorTextClass = () => {
      switch (errorType) {
        case "quota":
          return "text-orange-700"
        case "config":
          return "text-blue-700"
        default:
          return "text-red-700"
      }
    }

    return (
      <Alert className={getErrorClass()}>
        {getErrorIcon()}
        <AlertDescription className={getErrorTextClass()}>
          {error}
          {errorType === "config" && (
            <div className="mt-2">
              <Link href="/admin/api-keys">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 border-blue-300 hover:bg-blue-100 bg-transparent"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Configure API Keys
                </Button>
              </Link>
            </div>
          )}
          {errorType === "quota" && (
            <div className="mt-2 text-sm">
              <p>
                • Check your OpenAI billing at{" "}
                <a
                  href="https://platform.openai.com/account/billing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  platform.openai.com
                </a>
              </p>
              <p>
                • Configure OpenRouter as a backup in the{" "}
                <Link href="/admin/api-keys" className="underline">
                  admin panel
                </Link>
              </p>
            </div>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0 opacity-15">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="border-b border-emerald-500/30 bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  BrandForge
                </span>
              </Link>
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30">BANNER.AI</Badge>
            </div>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-emerald-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">BANNER.AI</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
            Professional banner generation for digital campaigns and marketing
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-black/80 backdrop-blur-xl border border-teal-500/40">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Sparkles className="w-5 h-5 mr-2 text-teal-400" />
                BANNER PARAMETERS
              </CardTitle>
              <CardDescription className="text-gray-400 font-mono">
                Configure design specifications for optimal banner generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-gray-300 font-mono">
                  DESIGN BRIEF
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., A modern tech company banner with clean lines and professional appeal"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="bg-gray-900/80 border-teal-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dimensions" className="text-gray-300 font-mono">
                    DIMENSIONS
                  </Label>
                  <Select value={dimensions} onValueChange={setDimensions}>
                    <SelectTrigger className="bg-gray-900/80 border-teal-500/40 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border-teal-500/40">
                      <SelectItem value="1920x1080">HD Banner (1920x1080)</SelectItem>
                      <SelectItem value="1200x628">Facebook Cover (1200x628)</SelectItem>
                      <SelectItem value="1584x396">LinkedIn Banner (1584x396)</SelectItem>
                      <SelectItem value="1500x500">Twitter Header (1500x500)</SelectItem>
                      <SelectItem value="728x90">Web Banner (728x90)</SelectItem>
                      <SelectItem value="320x50">Mobile Banner (320x50)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style" className="text-gray-300 font-mono">
                    STYLE
                  </Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="bg-gray-900/80 border-teal-500/40 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border-teal-500/40">
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="elegant">Elegant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="colors" className="text-gray-300 font-mono">
                  COLOR SCHEME
                </Label>
                <Input
                  id="colors"
                  placeholder="e.g., blue and white with accent colors"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  className="bg-gray-900/80 border-teal-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 font-mono"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    GENERATING BANNER...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    GENERATE BANNER
                  </>
                )}
              </Button>

              {renderError()}

              {generationInfo && (
                <Alert className="bg-emerald-50 border-emerald-200">
                  <Info className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-700">
                    <strong>
                      {generationInfo.message || `Generated using ${generationInfo.provider.toUpperCase()}`}
                    </strong>
                    {generationInfo.fallbackUsed && (
                      <div className="text-sm mt-1 text-orange-600">
                        ⚠️ Primary provider failed, fallback was used successfully
                      </div>
                    )}
                    {generationInfo.promptEnhanced && (
                      <div className="text-sm mt-1 text-blue-600">
                        🔧 Prompt was automatically enhanced for better results
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Generated Banner Display */}
          <Card className="bg-black/80 backdrop-blur-xl border border-teal-500/40">
            <CardHeader>
              <CardTitle className="text-white">GENERATED BANNER</CardTitle>
              <CardDescription className="text-gray-400 font-mono">
                AI-generated banner ready for download and use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                {generatedBanner ? (
                  <img
                    src={generatedBanner || "/placeholder.svg"}
                    alt="Generated Banner"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-500 font-mono">Generated banner will appear here</p>
                  </div>
                )}
              </div>

              {generatedBanner && (
                <div className="mt-6 space-y-4">
                  <Button onClick={handleDownload} className="w-full bg-transparent" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Banner
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 font-mono"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    GENERATE NEW VERSION
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 bg-black/80 backdrop-blur-xl border border-teal-500/40">
          <CardHeader>
            <CardTitle className="text-white">💡 BANNER DESIGN TIPS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-teal-400 font-mono">PLATFORM OPTIMIZATION</h3>
                <p className="text-sm text-gray-400">
                  Choose the right dimensions for your target platform to ensure optimal display and engagement.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-teal-400 font-mono">VISUAL HIERARCHY</h3>
                <p className="text-sm text-gray-400">
                  Ensure clear visual hierarchy with prominent headlines and supporting elements for maximum impact.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-teal-400 font-mono">BRAND CONSISTENCY</h3>
                <p className="text-sm text-gray-400">
                  Maintain consistent branding elements across all banner variations for cohesive campaign messaging.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
