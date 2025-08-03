'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { 
  ArrowRight,
  Sparkles,
  Zap,
  Database,
  Play,
  ExternalLink,
  Wand2,
  Cpu,
  BarChart3,
  Users,
  Crown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import ModernNav from '@/components/modern-nav'
import ToolCards from '@/components/tool-cards'
import ImageShowcase from '@/components/image-showcase'
import PromptPanel from '@/components/prompt-panel'

// Dynamically import 3D components to avoid SSR issues
const ThreeBackground = dynamic(() => import('@/components/three-background'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-transparent" />
})
const HeroBackground = dynamic(() => import('@/components/hero-background'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-transparent" />
})

export default function HomePage() {
  const [isPromptPanelOpen, setIsPromptPanelOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Global 3D Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-transparent" />}>
        <ThreeBackground />
      </Suspense>
      
      {/* Animated Background Elements */}
      <div
        className="absolute top-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl animate-pulse-glow"
        style={{
          left: `${20 + mousePosition.x * 0.1}%`,
          transform: `translate(-50%, -50%)`,
        }}
      ></div>
      <div
        className="absolute bottom-1/4 w-96 h-96 bg-slate-400/6 rounded-full blur-3xl animate-pulse-glow"
        style={{
          right: `${20 + mousePosition.y * 0.1}%`,
          transform: `translate(50%, 50%)`,
          animationDelay: '1s'
        }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-600/10 rounded-full blur-2xl animate-pulse-glow"
        style={{
          transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
          animationDelay: '0.5s'
        }}
      ></div>

      {/* Navigation */}
      <ModernNav />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        {/* Hero 3D Background */}
        <Suspense fallback={<div className="absolute inset-0 bg-transparent" />}>
          <HeroBackground />
        </Suspense>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="flex justify-center mb-12 animate-fade-in">
            <Badge className="bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-400 px-8 py-3 text-sm font-medium">
              <Cpu className="w-4 h-4 mr-2" />
              ENTERPRISE AI PLATFORM
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-10 leading-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
              Professional Brand
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              Design Automation
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in font-light" style={{ animationDelay: '0.4s' }}>
            Transform your brand identity with enterprise-grade AI. Create consistent, professional assets
            that scale with your business and maintain brand excellence across all touchpoints.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button
              size="lg"
              onClick={() => setIsPromptPanelOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-lg px-10 py-4 h-auto shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 group font-medium"
            >
              <Sparkles className="mr-3 w-5 h-5 group-hover:rotate-12 transition-transform" />
              Start Creating
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-slate-500/30 text-slate-300 hover:bg-slate-800/50 hover:border-emerald-500/50 hover:text-emerald-400 text-lg px-10 py-4 h-auto backdrop-blur-sm transition-all duration-300 group font-medium"
            >
              <Link href="#showcase">
                <Play className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                View Portfolio
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div className="group">
                  <div className="text-4xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform">99.9%</div>
                  <div className="text-gray-400 text-sm font-mono">System Uptime</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform">2.3s</div>
                  <div className="text-gray-400 text-sm font-mono">Avg Generation</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-bold text-pink-400 mb-2 group-hover:scale-110 transition-transform">50K+</div>
                  <div className="text-gray-400 text-sm font-mono">Assets Created</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-bold text-indigo-400 mb-2 group-hover:scale-110 transition-transform">∞</div>
                  <div className="text-gray-400 text-sm font-mono">Daily Limit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Cards Section */}
      <ToolCards />

      {/* Image Showcase Section */}
      <ImageShowcase />

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 px-4 py-2 mb-6">
              <BarChart3 className="w-4 h-4 mr-2" />
              ENTERPRISE FEATURES
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
                Everything You Need
              </span>
              <br />
              <span className="text-gray-200 text-3xl md:text-5xl">To Scale Your Brand</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-black/80 backdrop-blur-xl border border-blue-500/40 hover:border-blue-500/60 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Lightning Fast</h3>
                <p className="text-gray-300 leading-relaxed">
                  Generate professional designs in seconds, not hours. Our AI processes your ideas at incredible speed.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-black/80 backdrop-blur-xl border border-purple-500/40 hover:border-purple-500/60 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Premium Quality</h3>
                <p className="text-gray-300 leading-relaxed">
                  Every asset is crafted with professional-grade quality that rivals top design agencies.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-black/80 backdrop-blur-xl border border-green-500/40 hover:border-green-500/60 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:shadow-green-500/40 transition-all duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Team Collaboration</h3>
                <p className="text-gray-300 leading-relaxed">
                  Share, iterate, and collaborate with your team in real-time with built-in feedback tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-pink-900/50"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
              Ready to Transform
            </span>
            <br />
            <span className="text-gray-200 text-3xl md:text-5xl">Your Brand?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Join thousands of businesses using AI to create stunning brand assets.
            Start your creative journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-10 py-4 h-auto shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group"
              >
                <Database className="mr-3 w-5 h-5" />
                Access Dashboard
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsPromptPanelOpen(true)}
              className="border-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 text-lg px-10 py-4 h-auto backdrop-blur-sm transition-all duration-300 group"
            >
              <Wand2 className="mr-3 w-5 h-5 group-hover:rotate-12 transition-transform" />
              Try AI Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/90 backdrop-blur-xl border-t border-blue-500/30 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                  BrandForge
                </span>
              </div>
              <p className="text-gray-400 font-mono text-sm leading-relaxed">
                AI-Powered Design Suite v3.0
                <br />
                Creating the future of branding.
              </p>
            </div>

            {/* Tools */}
            <div>
              <h3 className="font-semibold mb-6 text-blue-400 text-lg">AI Tools</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link href="/generate/logo" className="hover:text-blue-400 transition-colors">Logo Generator</Link></li>
                <li><Link href="/generate/banner" className="hover:text-blue-400 transition-colors">Banner Creator</Link></li>
                <li><Link href="/generate/poster" className="hover:text-blue-400 transition-colors">Poster Designer</Link></li>
                <li><Link href="/generate/businesscard" className="hover:text-blue-400 transition-colors">Business Card Designer</Link></li>
                <li><Link href="/generate/slogan" className="hover:text-blue-400 transition-colors">Slogan Wizard</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-6 text-blue-400 text-lg">Resources</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
                <li><Link href="#showcase" className="hover:text-blue-400 transition-colors">Examples</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Support</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-6 text-blue-400 text-lg">Company</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-500/20 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 BrandForge AI. All rights reserved. Designed with ❤️ for creators.
            </p>
          </div>
        </div>
      </footer>

      {/* Prompt Panel */}
      <PromptPanel
        isOpen={isPromptPanelOpen}
        onClose={() => setIsPromptPanelOpen(false)}
      />

      {/* Floating Action Button */}
      {!isPromptPanelOpen && (
        <Button
          onClick={() => setIsPromptPanelOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 z-40 group"
        >
          <Wand2 className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        </Button>
      )}
    </div>
  )
}
