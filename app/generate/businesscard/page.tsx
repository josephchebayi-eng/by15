'use client'

import { useState } from 'react'
import { ArrowLeft, Download, Share2, CreditCard, Palette, Type, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function BusinessCardGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [style, setStyle] = useState('modern')

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Header */}
      <header className="border-b border-pink-500/30 bg-black/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-pink-400">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/25">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Business Card Designer</h1>
                  <p className="text-sm text-gray-400">Create professional business cards with AI</p>
                </div>
              </div>
            </div>
            <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
              BUSINESS.AI
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card className="bg-black/80 backdrop-blur-xl border border-pink-500/40 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-pink-400 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Design Your Business Card
              </CardTitle>
              <CardDescription className="text-gray-300">
                Enter your business details and let AI create the perfect professional card
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-pink-300 font-medium">
                  Company Name
                </Label>
                <Input
                  id="company"
                  placeholder="Your Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-black/50 border-gray-700 focus:border-pink-500 text-white"
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-pink-300 font-medium">
                  Contact Information
                </Label>
                <Textarea
                  id="contact"
                  placeholder="John Doe&#10;CEO & Founder&#10;john@company.com&#10;+1 (555) 123-4567&#10;www.company.com"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="min-h-[120px] bg-black/50 border-gray-700 focus:border-pink-500 text-white resize-none"
                />
              </div>

              {/* Style Selection */}
              <div className="space-y-2">
                <Label className="text-pink-300 font-medium">Design Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="bg-black/50 border-gray-700 focus:border-pink-500 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 backdrop-blur-xl border-gray-700">
                    <SelectItem value="modern">Modern & Clean</SelectItem>
                    <SelectItem value="corporate">Corporate Professional</SelectItem>
                    <SelectItem value="creative">Creative & Artistic</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                    <SelectItem value="elegant">Elegant & Sophisticated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Prompt */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-pink-300 font-medium">
                  Additional Requirements (Optional)
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Any specific design preferences, colors, or style notes..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[80px] bg-black/50 border-gray-700 focus:border-pink-500 text-white resize-none"
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerate}
                disabled={!companyName.trim() || !contactInfo.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg shadow-pink-500/25 py-3 font-medium"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Generating Business Card...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Generate Business Card</span>
                    <Zap className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="bg-black/80 backdrop-blur-xl border border-pink-500/40 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-pink-400 flex items-center">
                <Type className="w-5 h-5 mr-2" />
                Preview
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your business card will appear here once generated
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder Preview */}
              <div className="aspect-[1.75/1] bg-gradient-to-br from-pink-900/20 to-rose-900/20 border-2 border-dashed border-pink-500/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <CreditCard className="w-16 h-16 text-pink-500/50 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg font-medium mb-2">Business Card Preview</p>
                  <p className="text-gray-500 text-sm">Fill in the details and generate to see your card</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 border-pink-500/50 text-pink-400 hover:bg-pink-500/10"
                  disabled
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-pink-500/50 text-pink-400 hover:bg-pink-500/10"
                  disabled
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Features */}
              <div className="mt-8 space-y-3">
                <h3 className="text-pink-300 font-medium text-sm uppercase tracking-wider">Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Standard Business Card Size (3.5" × 2")</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">300 DPI Print-Ready Format</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">QR Code Integration Available</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Multiple File Formats (PNG, PDF, SVG)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
