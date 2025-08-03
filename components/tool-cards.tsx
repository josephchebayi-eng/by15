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
    description: 'Create sophisticated, scalable vector logos with enterprise-grade AI design intelligence',
    icon: Palette,
    color: 'emerald',
    features: ['Vector SVG Output', 'Brand Guidelines', 'Color Systems', 'Format Export'],
    gradient: 'from-emerald-600 to-emerald-700',
    hoverGradient: 'from-emerald-700 to-emerald-800',
    glowColor: 'emerald-500',
    path: '/generate/logo'
  },
  {
    id: 'banner',
    name: 'Digital Banners',
    description: 'Generate professional banners optimized for digital marketing campaigns',
    icon: Target,
    color: 'slate',
    features: ['Platform Optimization', 'Performance Analytics', 'A/B Testing', 'Brand Compliance'],
    gradient: 'from-slate-600 to-slate-700',
    hoverGradient: 'from-slate-700 to-slate-800',
    glowColor: 'slate-500',
    path: '/generate/banner'
  },
  {
    id: 'poster',
    name: 'Print Materials',
    description: 'Design large-format print materials with professional specifications',
    icon: TrendingUp,
    color: 'slate',
    features: ['CMYK Color Space', 'Bleed Management', 'Print Optimization', 'Paper Profiles'],
    gradient: 'from-slate-600 to-slate-700',
    hoverGradient: 'from-slate-700 to-slate-800',
    glowColor: 'slate-500',
    path: '/generate/poster'
  },
  {
    id: 'businesscard',
    name: 'Business Cards',
    description: 'Professional business cards with sophisticated typography and layout',
    icon: CreditCard,
    color: 'emerald',
    features: ['Industry Standards', 'Contact Hierarchy', 'QR Integration', 'Premium Finishes'],
    gradient: 'from-emerald-600 to-emerald-700',
    hoverGradient: 'from-emerald-700 to-emerald-800',
    glowColor: 'emerald-500',
    path: '/generate/businesscard'
  },
  {
    id: 'slogan',
    name: 'Brand Messaging',
    description: 'Develop strategic brand messaging that resonates with target audiences',
    icon: MessageSquare,
    color: 'slate',
    features: ['Audience Research', 'Message Testing', 'Tone Analysis', 'Market Positioning'],
    gradient: 'from-slate-600 to-slate-700',
    hoverGradient: 'from-slate-700 to-slate-800',
    glowColor: 'slate-500',
    path: '/generate/slogan'
  },
  {
    id: 'tagline',
    name: 'Corporate Taglines',
    description: 'Strategic taglines that communicate brand value and market position',
    icon: Type,
    color: 'emerald',
    features: ['Strategic Positioning', 'Market Research', 'Brand Architecture', 'Competitive Analysis'],
    gradient: 'from-emerald-600 to-emerald-700',
    hoverGradient: 'from-emerald-700 to-emerald-800',
    glowColor: 'emerald-500',
    path: '/generate/tagline'
  },
  {
    id: 'brandname',
    name: 'Brand Identity',
    description: 'Comprehensive brand naming with legal and market research integration',
    icon: Hash,
    color: 'slate',
    features: ['Trademark Search', 'Domain Analysis', 'Cultural Research', 'Linguistic Testing'],
    gradient: 'from-slate-600 to-slate-700',
    hoverGradient: 'from-slate-700 to-slate-800',
    glowColor: 'slate-500',
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
          <Badge className="bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-400 px-6 py-3 mb-8 font-medium">
            <Wand2 className="w-4 h-4 mr-2" />
            ENTERPRISE DESIGN SUITE
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
              Professional Brand Assets
            </span>
            <br />
            <span className="text-slate-400 text-3xl md:text-5xl font-light">at Enterprise Scale</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
            Streamline your brand operations with AI-powered design automation. Maintain consistency,
            reduce costs, and accelerate time-to-market across all brand touchpoints.
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
                <div className={`absolute inset-0 bg-gradient-to-br from-lime-500/20 to-lime-600/15 rounded-3xl blur-xl transition-all duration-500 ${
                  isHovered ? 'opacity-100 blur-2xl' : 'opacity-60'
                }`}></div>

                <Card className={`relative bg-lime-glass-200 backdrop-blur-xl border border-lime-500/30 shadow-glass-lime transition-all duration-500 rounded-3xl overflow-hidden ${
                  isHovered ? 'shadow-glass-lime-hover scale-105 border-lime-400/50' : ''
                }`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-lime-500/10 via-lime-400/5 to-transparent"></div>
                  
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-15">
                    <div
                      className="w-full h-full bg-gradient-to-br from-lime-400/40 to-transparent"
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
          <div className="inline-flex items-center space-x-8 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl px-8 py-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-slate-300 font-medium text-sm uppercase tracking-wider">System Operational</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-slate-400 rounded-full animate-pulse delay-200"></div>
              <span className="text-slate-300 font-medium text-sm uppercase tracking-wider">Enterprise Ready</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse delay-400"></div>
              <span className="text-slate-300 font-medium text-sm uppercase tracking-wider">SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
