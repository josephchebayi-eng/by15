"use client"

import { useState } from "react"
import {
  Palette,
  Download,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Info,
  AlertTriangle,
  Settings,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface QualityAssessment {
  score: number
  meetsRequirements: boolean
  feedback: string
  strengths: string[]
  improvements: string[]
}

export default function LogoGeneratorPage() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("modern")
  const [colors, setColors] = useState("blue and white")
  const [industry, setIndustry] = useState("")
  const [formats, setFormats] = useState(["svg"])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLogo, setGeneratedLogo] = useState<{
    svg: string
    formats: { svg: string; png?: string; jpeg?: string }
    qualityAssessment?: QualityAssessment
    regenerationCount?: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<"general" | "quota" | "config" | null>(null)
  const [generationInfo, setGenerationInfo] = useState<{
    provider: string
    fallbackUsed: boolean
    message?: string
    promptEnhanced?: boolean
  } | null>(null)

  const handleFormatChange = (format: string, checked: boolean) => {
    if (checked) {
      setFormats([...formats, format])
    } else {
      setFormats(formats.filter((f) => f !== format))
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)
    setErrorType(null)
    setGenerationInfo(null)

    try {
      const response = await fetch("/api/generate/logo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style,
          colors,
          industry,
          formats,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedLogo({
          svg: data.svg,
          formats: data.formats,
          qualityAssessment: data.qualityAssessment,
          regenerationCount: data.regenerationCount,
        })
        setGenerationInfo({
          provider: data.provider,
          fallbackUsed: data.fallbackUsed || false,
          message: data.message,
          promptEnhanced: data.promptEnhanced,
        })
      } else {
        setError(data.error || "Failed to generate logo")

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

  const handleDownload = (format: string) => {
    if (!generatedLogo) return

    const content =
      format === "svg" ? generatedLogo.svg : generatedLogo.formats[format as keyof typeof generatedLogo.formats]
    if (!content) return

    const blob = new Blob([content], {
      type: format === "svg" ? "image/svg+xml" : `image/${format}`,
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `logo.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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

  const renderQualityAssessment = () => {
    if (!generatedLogo?.qualityAssessment) return null

    const assessment = generatedLogo.qualityAssessment
    const scoreColor =
      assessment.score >= 8 ? "text-green-600" : assessment.score >= 6 ? "text-yellow-600" : "text-red-600"
    const scoreIcon = assessment.score >= 8 ? CheckCircle : assessment.score >= 6 ? Star : XCircle

    return (
      <Card className="mt-4 bg-gray-50 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-sm">
            <scoreIcon className={`w-4 h-4 mr-2 ${scoreColor}`} />
            AI Quality Assessment
            <Badge variant="outline" className="ml-2">
              {assessment.score}/10
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-700">{assessment.feedback}</p>
            </div>

            {assessment.strengths.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-green-700 mb-1">Strengths:</h4>
                <ul className="text-xs text-green-600 space-y-1">
                  {assessment.strengths.map((strength, index) => (
                    <li key={index}>• {strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {assessment.improvements.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-orange-700 mb-1">Suggestions:</h4>
                <ul className="text-xs text-orange-600 space-y-1">
                  {assessment.improvements.map((improvement, index) => (
                    <li key={index}>• {improvement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
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
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">LOGO.AI</Badge>
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
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">LOGO.AI</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
            Professional SVG logo generation with AI-powered design intelligence and quality assurance
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-black/80 backdrop-blur-xl border border-emerald-500/40">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Sparkles className="w-5 h-5 mr-2 text-emerald-400" />
                LOGO PARAMETERS
              </CardTitle>
              <CardDescription className="text-gray-400 font-mono">
                Configure design specifications for optimal logo generation with AI quality checking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-gray-300 font-mono">
                  DESIGN BRIEF
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., A modern tech company logo with clean lines and a futuristic feel"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="bg-gray-900/80 border-emerald-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style" className="text-gray-300 font-mono">
                    STYLE
                  </Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="bg-gray-900/80 border-emerald-500/40 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border-emerald-500/40">
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="vintage">Vintage</SelectItem>
                      <SelectItem value="playful">Playful</SelectItem>
                      <SelectItem value="elegant">Elegant</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colors" className="text-gray-300 font-mono">
                    COLOR SCHEME
                  </Label>
                  <Input
                    id="colors"
                    placeholder="e.g., blue and white"
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    className="bg-gray-900/80 border-emerald-500/40 text-gray-200 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-gray-300 font-mono">
                  INDUSTRY (OPTIONAL)
                </Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology, Healthcare, Finance"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="bg-gray-900/80 border-emerald-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 font-mono">OUTPUT FORMATS</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="svg"
                      checked={formats.includes("svg")}
                      onCheckedChange={(checked) => handleFormatChange("svg", checked as boolean)}
                      disabled
                    />
                    <Label htmlFor="svg" className="text-gray-400">
                      SVG (Vector)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="png"
                      checked={formats.includes("png")}
                      onCheckedChange={(checked) => handleFormatChange("png", checked as boolean)}
                    />
                    <Label htmlFor="png" className="text-gray-400">
                      PNG (Raster)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="jpeg"
                      checked={formats.includes("jpeg")}
                      onCheckedChange={(checked) => handleFormatChange("jpeg", checked as boolean)}
                    />
                    <Label htmlFor="jpeg" className="text-gray-400">
                      JPEG (Photo)
                    </Label>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-mono"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    GENERATING LOGO...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    GENERATE LOGO
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
                        🎨 Prompt enhanced with professional design specifications
                      </div>
                    )}
                    {generatedLogo?.regenerationCount && generatedLogo.regenerationCount > 0 && (
                      <div className="text-sm mt-1 text-purple-600">
                        🔄 {generatedLogo.regenerationCount} regeneration(s) performed for quality assurance
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Generated Logo Display */}
          <Card className="bg-black/80 backdrop-blur-xl border border-emerald-500/40">
            <CardHeader>
              <CardTitle className="text-white">GENERATED LOGO</CardTitle>
              <CardDescription className="text-gray-400 font-mono">
                AI-generated logo with quality assessment and multiple format options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                {generatedLogo ? (
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div dangerouslySetInnerHTML={{ __html: generatedLogo.svg }} className="max-w-full max-h-full" />
                  </div>
                ) : (
                  <div className="text-center">
                    <Palette className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-500 font-mono">Generated logo will appear here</p>
                  </div>
                )}
              </div>

              {generatedLogo && (
                <div className="mt-6 space-y-4">
                  <Tabs defaultValue="downloads" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="downloads">Downloads</TabsTrigger>
                      <TabsTrigger value="quality">Quality Report</TabsTrigger>
                    </TabsList>

                    <TabsContent value="downloads" className="space-y-2">
                      {formats.map((format) => (
                        <Button
                          key={format}
                          onClick={() => handleDownload(format)}
                          className="w-full bg-transparent"
                          variant="outline"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download {format.toUpperCase()}
                        </Button>
                      ))}
                    </TabsContent>

                    <TabsContent value="quality">{renderQualityAssessment()}</TabsContent>
                  </Tabs>

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-mono"
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
        <Card className="mt-8 bg-black/80 backdrop-blur-xl border border-emerald-500/40">
          <CardHeader>
            <CardTitle className="text-white">💡 LOGO DESIGN TIPS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-emerald-400 font-mono">DESIGN CLARITY</h3>
                <p className="text-sm text-gray-400">
                  Include specific details about your industry, target audience, and desired aesthetic for better
                  results.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-emerald-400 font-mono">SCALABILITY</h3>
                <p className="text-sm text-gray-400">
                  SVG format ensures your logo looks crisp at any size, from business cards to billboards.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-emerald-400 font-mono">QUALITY ASSURANCE</h3>
                <p className="text-sm text-gray-400">
                  Our AI automatically evaluates each logo and may regenerate for better quality results.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-emerald-400 font-mono">MULTIPLE FORMATS</h3>
                <p className="text-sm text-gray-400">
                  Download in SVG, PNG, or JPEG formats for different use cases and applications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
