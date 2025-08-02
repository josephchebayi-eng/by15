"use client"

import { useState } from "react"
import { Palette, RefreshCw, Sparkles, ArrowLeft, Hash, Copy, ExternalLink, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface BrandName {
  name: string
  domain: string
  available: boolean
  trademark: boolean
}

export default function BrandNameGeneratorPage() {
  const [industry, setIndustry] = useState("technology")
  const [style, setStyle] = useState("modern")
  const [keywords, setKeywords] = useState("")
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedNames, setGeneratedNames] = useState<BrandName[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate/brandname", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          industry,
          style,
          keywords,
          description,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedNames(data.brandNames)
      } else {
        setError(data.error || "Failed to generate brand names")
      }
    } catch (err) {
      setError("An error occurred while generating brand names")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name)
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
              <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">BRANDNAME.AI</Badge>
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
            <span className="bg-gradient-to-r from-pink-400 to-rose-300 bg-clip-text text-transparent">
              BRANDNAME.AI
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
            Generate unique brand names with domain and trademark availability
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-black/80 backdrop-blur-xl border border-pink-500/40">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Sparkles className="w-5 h-5 mr-2 text-pink-400" />
                BRAND PARAMETERS
              </CardTitle>
              <CardDescription className="text-gray-400 font-mono">
                Define your brand characteristics for optimal name generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300 font-mono">
                  BUSINESS DESCRIPTION
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your business, products, or services"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="bg-gray-900/80 border-pink-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords" className="text-gray-300 font-mono">
                  KEYWORDS
                </Label>
                <Input
                  id="keywords"
                  placeholder="Enter relevant keywords (comma separated)"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="bg-gray-900/80 border-pink-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-gray-300 font-mono">
                    INDUSTRY
                  </Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="bg-gray-900/80 border-pink-500/40 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border-pink-500/40">
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style" className="text-gray-300 font-mono">
                    NAMING STYLE
                  </Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="bg-gray-900/80 border-pink-500/40 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border-pink-500/40">
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="descriptive">Descriptive</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                      <SelectItem value="compound">Compound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 font-mono"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    GENERATING NAMES...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    GENERATE BRAND NAMES
                  </>
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm font-mono">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Names Display */}
          <Card className="bg-black/80 backdrop-blur-xl border border-pink-500/40">
            <CardHeader>
              <CardTitle className="text-white">GENERATED BRAND NAMES</CardTitle>
              <CardDescription className="text-gray-400 font-mono">
                Available names with domain and trademark status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedNames.length > 0 ? (
                  generatedNames.map((brandName, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-900/60 border border-pink-500/30 rounded-lg hover:border-pink-500/50 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">{brandName.name}</h3>
                        <Button
                          onClick={() => copyToClipboard(brandName.name)}
                          variant="ghost"
                          size="sm"
                          className="text-pink-400 hover:text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 font-mono">DOMAIN:</span>
                          <span className="text-gray-300">{brandName.domain}</span>
                          {brandName.available ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4">
                          <Badge
                            className={`text-xs font-mono ${
                              brandName.available
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : "bg-red-500/20 text-red-300 border-red-500/30"
                            }`}
                          >
                            {brandName.available ? "DOMAIN AVAILABLE" : "DOMAIN TAKEN"}
                          </Badge>
                          <Badge
                            className={`text-xs font-mono ${
                              brandName.trademark
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                            }`}
                          >
                            {brandName.trademark ? "TM CLEAR" : "TM CHECK NEEDED"}
                          </Badge>
                        </div>

                        {brandName.available && (
                          <Button variant="ghost" size="sm" className="text-pink-400 hover:text-pink-300">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Register
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Hash className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-500 font-mono">Generated brand names will appear here</p>
                  </div>
                )}
              </div>

              {generatedNames.length > 0 && (
                <div className="mt-6 space-y-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 font-mono"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    GENERATE NEW BATCH
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 bg-black/80 backdrop-blur-xl border border-pink-500/40">
          <CardHeader>
            <CardTitle className="text-white">💡 BRAND NAMING TIPS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-pink-400 font-mono">DOMAIN PRIORITY</h3>
                <p className="text-sm text-gray-400">
                  Prioritize names with available .com domains for better brand recognition and SEO.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-pink-400 font-mono">TRADEMARK CHECK</h3>
                <p className="text-sm text-gray-400">
                  Always conduct thorough trademark searches before finalizing your brand name choice.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-pink-400 font-mono">GLOBAL CONSIDERATIONS</h3>
                <p className="text-sm text-gray-400">
                  Consider how your brand name translates and sounds in different languages and cultures.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
