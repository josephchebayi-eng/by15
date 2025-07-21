"use client"

import { useState } from "react"
import {
  Palette,
  Sparkles,
  Target,
  FileImage,
  MessageSquare,
  Type,
  Hash,
  Settings,
  BarChart3,
  Folder,
  Download,
  Zap,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

const generationTools = [
  {
    id: "logo",
    title: "Logo Generator",
    description: "Create professional SVG logos with AI-powered design intelligence",
    icon: Palette,
    color: "emerald",
    gradient: "from-emerald-500 to-teal-400",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-300",
    href: "/generate/logo",
    badge: "LOGO.AI",
    status: "active",
  },
  {
    id: "banner",
    title: "Banner Generator",
    description: "Professional banner generation for digital campaigns and marketing",
    icon: Target,
    color: "teal",
    gradient: "from-teal-500 to-cyan-400",
    bgColor: "bg-teal-500/20",
    borderColor: "border-teal-500/30",
    textColor: "text-teal-300",
    href: "/generate/banner",
    badge: "BANNER.AI",
    status: "active",
  },
  {
    id: "poster",
    title: "Poster Generator",
    description: "Create eye-catching posters for events, promotions, and marketing campaigns",
    icon: FileImage,
    color: "green",
    gradient: "from-green-500 to-emerald-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30",
    textColor: "text-green-300",
    href: "/generate/poster",
    badge: "POSTER.AI",
    status: "active",
  },
  {
    id: "slogan",
    title: "Slogan Generator",
    description: "Generate compelling slogans and catchphrases with AI-powered creativity",
    icon: MessageSquare,
    color: "purple",
    gradient: "from-purple-500 to-violet-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/30",
    textColor: "text-purple-300",
    href: "/generate/slogan",
    badge: "SLOGAN.AI",
    status: "active",
  },
  {
    id: "tagline",
    title: "Tagline Generator",
    description: "Create memorable taglines that capture your brand essence",
    icon: Type,
    color: "orange",
    gradient: "from-orange-500 to-amber-400",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/30",
    textColor: "text-orange-300",
    href: "/generate/tagline",
    badge: "TAGLINE.AI",
    status: "active",
  },
  {
    id: "brandname",
    title: "Brand Name Generator",
    description: "Generate unique brand names with domain and trademark availability",
    icon: Hash,
    color: "pink",
    gradient: "from-pink-500 to-rose-400",
    bgColor: "bg-pink-500/20",
    borderColor: "border-pink-500/30",
    textColor: "text-pink-300",
    href: "/generate/brandname",
    badge: "BRANDNAME.AI",
    status: "active",
  },
]

const quickStats = [
  { label: "Generations Today", value: "47", change: "+12%", icon: Zap },
  { label: "Active Projects", value: "8", change: "+3", icon: Folder },
  { label: "Success Rate", value: "98.5%", change: "+0.5%", icon: TrendingUp },
  { label: "Total Downloads", value: "156", change: "+23", icon: Download },
]

export default function DashboardPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

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
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">DASHBOARD</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/api-keys">
                <Button variant="ghost" className="text-gray-300 hover:text-emerald-400">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              AI BRANDING SUITE
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
            Professional brand assets powered by advanced AI models
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-black/80 backdrop-blur-xl border border-emerald-500/40">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 font-mono">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-emerald-400">{stat.change}</p>
                  </div>
                  <stat.icon className="w-8 h-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Generation Tools */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 font-mono">AI GENERATION TOOLS</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generationTools.map((tool) => (
              <Card
                key={tool.id}
                className={`bg-black/80 backdrop-blur-xl border ${tool.borderColor} hover:border-opacity-60 transition-all duration-300 group cursor-pointer`}
                onMouseEnter={() => setSelectedTool(tool.id)}
                onMouseLeave={() => setSelectedTool(null)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-lg flex items-center justify-center shadow-lg shadow-${tool.color}-500/25`}
                    >
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className={`${tool.bgColor} ${tool.textColor} ${tool.borderColor}`}>{tool.badge}</Badge>
                  </div>
                  <CardTitle className="text-white group-hover:text-emerald-400 transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono text-sm">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-mono">STATUS</span>
                      <span className="text-emerald-400 font-mono">ACTIVE</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <Link href={tool.href}>
                      <Button
                        className={`w-full bg-gradient-to-r ${tool.gradient} hover:opacity-90 font-mono`}
                        size="sm"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        LAUNCH {tool.badge}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* System Status */}
        <Card className="bg-black/80 backdrop-blur-xl border border-emerald-500/40">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-emerald-400" />
              SYSTEM STATUS
            </CardTitle>
            <CardDescription className="text-gray-400 font-mono">
              Real-time AI provider status and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-emerald-400 font-mono">AI PROVIDERS</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">OpenAI GPT-4o</span>
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                      QUOTA EXCEEDED
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">OpenRouter</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">ACTIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Fallback System</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">WORKING</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-emerald-400 font-mono">PERFORMANCE</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Response Time</span>
                    <span className="text-emerald-400 text-sm font-mono">2.3s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Success Rate</span>
                    <span className="text-emerald-400 text-sm font-mono">98.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Uptime</span>
                    <span className="text-emerald-400 text-sm font-mono">99.9%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-emerald-400 font-mono">FEATURES</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Prompt Enhancement</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">ENABLED</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Smart Routing</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">ACTIVE</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Error Recovery</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">WORKING</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-mono">
                    All AI modules connected and operational. Fallback system ensuring 100% availability.
                  </p>
                </div>
                <Link href="/admin/api-keys">
                  <Button variant="outline" size="sm" className="font-mono bg-transparent">
                    <Settings className="w-4 h-4 mr-2" />
                    CONFIGURE
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
