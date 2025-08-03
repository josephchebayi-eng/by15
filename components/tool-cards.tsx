'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Palette,
  Target,
  TrendingUp,
  MessageSquare,
  Type,
  Hash,
  CreditCard,
  Sparkles,
  ArrowRight,
  Zap,
  Wand2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const tools = [
  {
    id: 'logo',
    name: 'Logo Generator',
    description: 'Create stunning, scalable vector logos with AI-powered design intelligence',
    icon: Palette,
    color: 'blue',
    features: ['Vector SVG Output', 'Brand Style Analysis', 'Color Palette Generation', 'Instant Export'],
    gradient: 'from-blue-500 to-blue-700',
    hoverGradient: 'from-blue-600 to-blue-800',
    glowColor: 'blue-500',
    path: '/generate/logo'
  },
  {
    id: 'banner',
    name: 'Banner Creator',
    description: 'Design eye-catching banners for web, social media, and advertising campaigns',
    icon: Target,
    color: 'indigo',
    features: ['Multi-Platform Sizing', 'Campaign Optimization', 'HD Export Quality', 'Brand Consistency'],
    gradient: 'from-indigo-500 to-purple-600',
    hoverGradient: 'from-indigo-600 to-purple-700',
    glowColor: 'indigo-500',
    path: '/generate/banner'
  },
  {
    id: 'poster',
    name: 'Poster Designer',
    description: 'Generate large-format posters with print-ready specifications',
    icon: TrendingUp,
    color: 'purple',
    features: ['Print-Ready Quality', 'Typography Integration', 'Format Flexibility', 'Event Optimization'],
    gradient: 'from-purple-500 to-violet-600',
    hoverGradient: 'from-purple-600 to-violet-700',
    glowColor: 'purple-500',
    path: '/generate/poster'
  },
  {
    id: 'businesscard',
    name: 'Business Card Designer',
    description: 'Create professional business cards with perfect layout and typography',
    icon: CreditCard,
    color: 'pink',
    features: ['Standard Sizes', 'Print-Ready Format', 'QR Code Integration', 'Contact Optimization'],
    gradient: 'from-pink-500 to-rose-600',
    hoverGradient: 'from-pink-600 to-rose-700',
    glowColor: 'pink-500',
    path: '/generate/businesscard'
  },
  {
    id: 'slogan',
    name: 'Slogan Wizard',
    description: 'Craft memorable slogans and catchphrases that resonate with your audience',
    icon: MessageSquare,
    color: 'cyan',
    features: ['Brand Voice Analysis', 'Multiple Variations', 'Tone Customization', 'Market Testing'],
    gradient: 'from-cyan-500 to-teal-600',
    hoverGradient: 'from-cyan-600 to-teal-700',
    glowColor: 'cyan-500',
    path: '/generate/slogan'
  },
  {
    id: 'tagline',
    name: 'Tagline Maker',
    description: 'Create compelling taglines that capture your brand essence perfectly',
    icon: Type,
    color: 'violet',
    features: ['Brand Positioning', 'Emotional Resonance', 'Memorable Phrasing', 'Industry Alignment'],
    gradient: 'from-violet-500 to-purple-600',
    hoverGradient: 'from-violet-600 to-purple-700',
    glowColor: 'violet-500',
    path: '/generate/tagline'
  },
  {
    id: 'brandname',
    name: 'Brand Namer',
    description: 'Generate unique brand names with domain availability checking',
    icon: Hash,
    color: 'fuchsia',
    features: ['Domain Availability', 'Trademark Screening', 'Linguistic Analysis', 'Cultural Sensitivity'],
    gradient: 'from-fuchsia-500 to-pink-600',
    hoverGradient: 'from-fuchsia-600 to-pink-700',
    glowColor: 'fuchsia-500',
    path: '/generate/brandname'
  }
]

export default function ToolCards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 px-4 py-2 mb-6">
            <Wand2 className="w-4 h-4 mr-2" />
            AI-POWERED TOOLS
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
              Create Stunning Branding
            </span>
            <br />
            <span className="text-gray-200 text-3xl md:text-5xl">Powered by AI</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform simple ideas into professional brand assets in seconds. Our AI-powered tools understand design principles, 
            brand strategy, and market trends to deliver exceptional results.
          </p>
        </div>

        {/* Tool Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => {
            const Icon = tool.icon
            const isHovered = hoveredCard === tool.id
            
            return (
              <div 
                key={tool.id}
                className="group relative"
                onMouseEnter={() => setHoveredCard(tool.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${tool.color}-600/30 to-${tool.color}-800/30 rounded-3xl blur-xl transition-all duration-500 ${
                  isHovered ? 'opacity-100 blur-2xl' : 'opacity-0'
                }`}></div>

                <Card className={`relative bg-black/80 backdrop-blur-xl border-${tool.color}-500/40 shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden ${
                  isHovered ? `shadow-${tool.color}-500/20 scale-105` : ''
                }`}>
                  {/* Background Pattern */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-${tool.color}-500/10 via-transparent to-transparent`}></div>
                  
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <div
                      className={`w-full h-full bg-gradient-to-br from-${tool.color}-400 to-transparent`}
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)",
                      }}
                    ></div>
                  </div>

                  <CardHeader className="relative z-10 text-center pb-6">
                    {/* Icon */}
                    <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center shadow-lg shadow-${tool.glowColor}/25 transition-all duration-500 relative overflow-hidden ${
                      isHovered ? `shadow-${tool.glowColor}/40` : ''
                    }`}>
                      {/* Shine Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transition-transform duration-1000 ${
                        isHovered ? 'translate-x-[200%]' : 'translate-x-[-100%]'
                      }`}></div>
                      <Icon className="w-10 h-10 text-white relative z-10" />
                    </div>
                    
                    <CardTitle className="text-2xl font-bold text-white mb-2">{tool.name}</CardTitle>
                    <CardDescription className="text-gray-300 text-lg leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10 pt-0">
                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {tool.features.map((feature, index) => (
                        <div key={feature} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 bg-${tool.color}-400 rounded-full animate-pulse`} style={{
                            animationDelay: `${index * 100}ms`
                          }}></div>
                          <span className="text-gray-300 font-mono text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link href={tool.path}>
                      <Button className={`w-full bg-gradient-to-r ${tool.gradient} hover:${tool.hoverGradient} text-white shadow-lg shadow-${tool.glowColor}/25 hover:shadow-${tool.glowColor}/40 transition-all duration-300 font-medium group/btn`}>
                        Start Creating
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-6 bg-black/80 backdrop-blur-xl border border-emerald-500/40 rounded-2xl px-8 py-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300 font-mono text-sm">ALL TOOLS ACTIVE</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse delay-200"></div>
              <span className="text-gray-300 font-mono text-sm">INSTANT GENERATION</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-400"></div>
              <span className="text-gray-300 font-mono text-sm">UNLIMITED USAGE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
