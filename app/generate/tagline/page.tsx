"use client"

import { useState } from "react"
import { Palette, RefreshCw, Sparkles, ArrowLeft, Type, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function TaglineGeneratorPage() {
  const [brandName, setBrandName] = useState("")
  const [positioning, setPositioning] = useState("innovative")
  const [targetAudience, setTargetAudience] = useState("professionals")
  const [keyMessage, setKeyMessage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTaglines, setGeneratedTaglines] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!brandName.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate/tagline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName,
          positioning,
          targetAudience,
          keyMessage,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedTaglines(data.taglines)
      } else {
        setError(data.error || "Failed to generate taglines")
      }
    } catch (err) {
      setError("An error occurred while generating taglines")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (tagline: string) => {
    navigator.clipboard.writeText(tagline)
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
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">TAGLINE.AI</Badge>
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
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              TAGLINE.AI
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
            Create memorable taglines that capture your brand essence
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-lime-glass-200 backdrop-blur-xl border border-lime-500/30 shadow-glass-lime">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Sparkles className="w-5 h-5 mr-2 text-orange-400" />
                TAGLINE PARAMETERS
              </CardTitle>
              <CardDescription className="text-gray-400 font-mono">
                Define brand positioning for targeted tagline creation
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
                  className="bg-gray-900/80 border-orange-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyMessage" className="text-gray-300 font-mono">
                  KEY MESSAGE
                </Label>
                <Textarea
                  id="keyMessage"
                  placeholder="What's the main message you want to communicate?"
                  value={keyMessage}
                  onChange={(e) => setKeyMessage(e.target.value)}
                  rows={3}
                  className="bg-gray-900/80 border-orange-500/40 text-gray-200 placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="positioning" className="text-gray-300 font-mono">
                    POSITIONING
                  </Label>
                  <Select value={positioning} onValueChange={setPositioning}>
                    <SelectTrigger className="bg-gray-900/80 border-orange-500/40 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border-orange-500/40">
                      <SelectItem value="innovative">Innovative</SelectItem>
                      <SelectItem value="reliable">Reliable</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="accessible">Accessible</SelectItem>
                      <SelectItem value="sustainable">Sustainable</SelectItem>
                      <SelectItem value="disruptive">Disruptive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience" className="text-gray-300 font-mono">
                    TARGET AUDIENCE
                  </Label>
                  <Select value={targetAudience} onValueChange={setTargetAudience}>
                    <SelectTrigger className="bg-gray-900/80 border-orange-500/40 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border-orange-500/40">
                      <SelectItem value="professionals">Professionals</SelectItem>
                      <SelectItem value="consumers">Consumers</SelectItem>
                      <SelectItem value="millennials">Millennials</SelectItem>
                      <SelectItem value="enterprises">Enterprises</SelectItem>
                      <SelectItem value="startups">Startups</SelectItem>
                      <SelectItem value="families">Families</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!brandName.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 font-mono"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    GENERATING TAGLINES...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    GENERATE TAGLINES
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

          {/* Generated Taglines Display */}
          <Card className="bg-lime-glass-200 backdrop-blur-xl border border-lime-500/30 shadow-glass-lime">
            <CardHeader>
              <CardTitle className="text-white">GENERATED TAGLINES</CardTitle>
              <CardDescription className="text-gray-400 font-mono">
                Professional taglines for brand positioning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedTaglines.length > 0 ? (
                  generatedTaglines.map((tagline, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-900/60 border border-orange-500/30 rounded-lg hover:border-orange-500/50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-gray-300 flex-1 font-medium">{tagline}</p>
                        <Button
                          onClick={() => copyToClipboard(tagline)}
                          variant="ghost"
                          size="sm"
                          className="text-orange-400 hover:text-orange-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Type className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-500 font-mono">Generated taglines will appear here</p>
                  </div>
                )}
              </div>

              {generatedTaglines.length > 0 && (
                <div className="mt-6 space-y-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 font-mono"
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
        <Card className="mt-8 bg-black/80 backdrop-blur-xl border border-orange-500/40">
          <CardHeader>
            <CardTitle className="text-white">💡 TAGLINE CREATION TIPS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-orange-400 font-mono">EMOTIONAL CONNECTION</h3>
                <p className="text-sm text-gray-400">
                  Great taglines create emotional resonance with your target audience and brand values.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-orange-400 font-mono">MEMORABLE PHRASING</h3>
                <p className="text-sm text-gray-400">
                  Keep it short, punchy, and easy to remember. The best taglines stick in people's minds.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-orange-400 font-mono">BRAND ALIGNMENT</h3>
                <p className="text-sm text-gray-400">
                  Ensure your tagline aligns with your brand positioning and differentiates you from competitors.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
