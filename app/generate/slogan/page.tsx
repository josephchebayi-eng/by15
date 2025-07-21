"use client"

import { useState } from "react"
import { Palette, RefreshCw, Sparkles, ArrowLeft, MessageSquare, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function SloganGeneratorPage() {
  const [brandName, setBrandName] = useState("")
  const [industry, setIndustry] = useState("technology")
  const [tone, setTone] = useState("professional")
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSlogans, setGeneratedSlogans] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!brandName.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate/slogan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName,
          industry,
          tone,
          description,
          provider: "openai", // or 'openrouter'
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedSlogans(data.slogans)
      } else {
        setError(data.error || "Failed to generate slogans")
      }
    } catch (err) {
      setError("An error occurred while generating slogans")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (slogan: string) => {
    navigator.clipboard.writeText(slogan)
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
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">SLOGAN.AI</Badge>
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
            <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
              SLOGAN.AI
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
            Generate compelling slogans and catchphrases with AI-powered creativity
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-black/80 backdrop-blur-xl border border-purple-500/40">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                SLOGAN PARAMETERS
              </CardTitle>
              <CardDescription className="text-gray-400 font-mono">
                Configure brand parameters for optimal slogan generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="brandName" className="text-gray-300 font-mono">
                  BRAND NAME
                </Label>
                <Input
                  id="brandName"
                  placeholder="Enter your brand name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="bg-gray-900/80 border-purple-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300 font-mono">
                  BRAND DESCRIPTION
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your brand, products, or services"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="bg-gray-900/80 border-purple-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-gray-300 font-mono">
                    INDUSTRY
                  </Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="bg-gray-900/80 border-purple-500/40 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border-purple-500/40">
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone" className="text-gray-300 font-mono">
                    TONE
                  </Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="bg-gray-900/80 border-purple-500/40 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border-purple-500/40">
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="playful">Playful</SelectItem>
                      <SelectItem value="inspiring">Inspiring</SelectItem>
                      <SelectItem value="trustworthy">Trustworthy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!brandName.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 font-mono"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    GENERATING SLOGANS...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    GENERATE SLOGANS
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

          {/* Generated Slogans Display */}
          <Card className="bg-black/80 backdrop-blur-xl border border-purple-500/40">
            <CardHeader>
              <CardTitle className="text-white">GENERATED SLOGANS</CardTitle>
              <CardDescription className="text-gray-400 font-mono">
                AI-generated slogans ready for your brand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedSlogans.length > 0 ? (
                  generatedSlogans.map((slogan, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-900/60 border border-purple-500/30 rounded-lg hover:border-purple-500/50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-gray-300 flex-1">{slogan}</p>
                        <Button
                          onClick={() => copyToClipboard(slogan)}
                          variant="ghost"
                          size="sm"
                          className="text-purple-400 hover:text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-500 font-mono">Generated slogans will appear here</p>
                  </div>
                )}
              </div>

              {generatedSlogans.length > 0 && (
                <div className="mt-6 space-y-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 font-mono"
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
        <Card className="mt-8 bg-black/80 backdrop-blur-xl border border-purple-500/40">
          <CardHeader>
            <CardTitle className="text-white">💡 SLOGAN GENERATION TIPS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-purple-400 font-mono">BRAND CLARITY</h3>
                <p className="text-sm text-gray-400">
                  Provide clear brand description and values for more targeted slogan generation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-purple-400 font-mono">TONE MATCHING</h3>
                <p className="text-sm text-gray-400">
                  Select the tone that best represents your brand personality and target audience.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-purple-400 font-mono">ITERATION</h3>
                <p className="text-sm text-gray-400">
                  Generate multiple batches to explore different creative directions and find the perfect fit.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
