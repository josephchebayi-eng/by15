'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Wand2,
  Sparkles,
  Settings,
  Palette,
  Target,
  TrendingUp,
  MessageSquare,
  Type,
  Hash,
  CreditCard,
  ArrowRight,
  X
} from 'lucide-react'

const models = [
  { id: 'dall-e-3', name: 'DALL·E 3', description: 'Latest OpenAI image model' },
  { id: 'flux', name: 'FLUX.1 AI', description: 'High-quality image generation' }
]

const styles = [
  { id: 'minimalist', name: 'Minimalist', description: 'Clean and simple' },
  { id: 'modern', name: 'Modern', description: 'Contemporary design' },
  { id: 'vintage', name: 'Vintage', description: 'Classic and timeless' },
  { id: 'futuristic', name: 'Futuristic', description: 'Cutting-edge aesthetic' },
  { id: 'artistic', name: 'Artistic', description: 'Creative and expressive' },
  { id: 'corporate', name: 'Corporate', description: 'Professional business' }
]

const tools = [
  { id: 'logo', name: 'Logo', icon: Palette, color: 'blue' },
  { id: 'banner', name: 'Banner', icon: Target, color: 'indigo' },
  { id: 'poster', name: 'Poster', icon: TrendingUp, color: 'purple' },
  { id: 'businesscard', name: 'Business Card', icon: CreditCard, color: 'pink' },
  { id: 'slogan', name: 'Slogan', icon: MessageSquare, color: 'cyan' },
  { id: 'tagline', name: 'Tagline', icon: Type, color: 'violet' },
  { id: 'brandname', name: 'Brand Name', icon: Hash, color: 'fuchsia' }
]

interface PromptPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function PromptPanel({ isOpen, onClose }: PromptPanelProps) {
  const [selectedTool, setSelectedTool] = useState('logo')
  const [selectedProvider, setSelectedProvider] = useState('openai')
  const [selectedStyle, setSelectedStyle] = useState('modern')
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-96 z-50 transform transition-transform duration-300">
      <Card className="h-full bg-black/95 backdrop-blur-xl border-l border-blue-500/30 shadow-2xl rounded-none">
        <CardHeader className="border-b border-blue-500/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-400 font-mono">AI PROMPT STUDIO</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6 overflow-y-auto h-full">
          {/* Tool Selection */}
          <div className="space-y-3">
            <Label className="text-blue-300 font-mono text-xs uppercase tracking-wider">
              Select Tool
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {tools.map((tool) => {
                const Icon = tool.icon
                const isSelected = selectedTool === tool.id
                
                return (
                  <Button
                    key={tool.id}
                    variant={isSelected ? "default" : "ghost"}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`flex items-center space-x-2 p-3 h-auto justify-start ${
                      isSelected 
                        ? `bg-gradient-to-r from-${tool.color}-600 to-${tool.color}-700 text-white` 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tool.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-3">
            <Label htmlFor="prompt" className="text-blue-300 font-mono text-xs uppercase tracking-wider">
              Describe Your Vision
            </Label>
            <Textarea
              id="prompt"
              placeholder="A modern, minimalist logo for a tech startup with clean typography and geometric shapes..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] bg-black/50 border-gray-700 focus:border-blue-500 text-white resize-none"
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <Label className="text-blue-300 font-mono text-xs uppercase tracking-wider">
              Image Provider
            </Label>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="bg-black/50 border-gray-700 focus:border-blue-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-xl border-gray-700">
                <SelectItem value="openai" className="text-gray-300 focus:text-white">
                  <div>
                    <div className="font-medium">DALL·E 3</div>
                    <div className="text-xs text-gray-500">OpenAI's latest image model</div>
                  </div>
                </SelectItem>
                <SelectItem value="flux" className="text-gray-300 focus:text-white">
                  <div>
                    <div className="font-medium">FLUX.1 AI</div>
                    <div className="text-xs text-gray-500">High-quality image generation</div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Style Selection */}
          <div className="space-y-3">
            <Label className="text-blue-300 font-mono text-xs uppercase tracking-wider">
              Style
            </Label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="bg-black/50 border-gray-700 focus:border-blue-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-xl border-gray-700">
                {styles.map((style) => (
                  <SelectItem key={style.id} value={style.id} className="text-gray-300 focus:text-white">
                    <div>
                      <div className="font-medium">{style.name}</div>
                      <div className="text-xs text-gray-500">{style.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Options */}
          <div className="space-y-3">
            <Label className="text-blue-300 font-mono text-xs uppercase tracking-wider flex items-center">
              <Settings className="w-3 h-3 mr-1" />
              Advanced Options
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-400">Aspect Ratio</Label>
                <Select defaultValue="square">
                  <SelectTrigger className="bg-black/50 border-gray-700 focus:border-blue-500 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 backdrop-blur-xl border-gray-700">
                    <SelectItem value="square">1:1 Square</SelectItem>
                    <SelectItem value="landscape">16:9 Landscape</SelectItem>
                    <SelectItem value="portrait">9:16 Portrait</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-400">Quality</Label>
                <Select defaultValue="high">
                  <SelectTrigger className="bg-black/50 border-gray-700 focus:border-blue-500 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 backdrop-blur-xl border-gray-700">
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 py-3 font-medium"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Wand2 className="w-4 h-4" />
                  <span>Generate with AI</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>

          {/* Usage Stats */}
          <div className="pt-4 border-t border-gray-700">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Credits remaining</span>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Unlimited
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Generation time</span>
                <span className="text-gray-300">~2-5 seconds</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
