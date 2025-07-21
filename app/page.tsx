import {
  ArrowRight,
  Zap,
  Target,
  Palette,
  TrendingUp,
  Sparkles,
  Cpu,
  Database,
  Type,
  MessageSquare,
  Hash,
  ChevronDown,
  Key,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function HomePage() {
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

      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500/15 rounded-full blur-2xl animate-pulse delay-500"></div>

      {/* Navigation */}
      <nav className="border-b border-emerald-500/30 bg-black/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                BrandForge
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">INTERNAL</Badge>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {/* AI Modules Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                    AI Modules
                    <ChevronDown className="ml-1 w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="bg-black/90 backdrop-blur-xl border-emerald-500/40 min-w-[200px]"
                >
                  <DropdownMenuLabel className="text-emerald-300 font-mono text-xs">
                    VISUAL GENERATION
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/generate/logo" className="text-gray-300 hover:text-emerald-300 cursor-pointer">
                      <Palette className="w-4 h-4 mr-2 text-emerald-400" />
                      LOGO.AI
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/generate/banner" className="text-gray-300 hover:text-emerald-300 cursor-pointer">
                      <Target className="w-4 h-4 mr-2 text-teal-400" />
                      BANNER.AI
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/generate/poster" className="text-gray-300 hover:text-emerald-300 cursor-pointer">
                      <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                      POSTER.AI
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-emerald-500/20" />

                  <DropdownMenuLabel className="text-emerald-300 font-mono text-xs">TEXT GENERATION</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/generate/slogan" className="text-gray-300 hover:text-emerald-300 cursor-pointer">
                      <MessageSquare className="w-4 h-4 mr-2 text-purple-400" />
                      SLOGAN.AI
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/generate/tagline" className="text-gray-300 hover:text-emerald-300 cursor-pointer">
                      <Type className="w-4 h-4 mr-2 text-orange-400" />
                      TAGLINE.AI
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/generate/brandname" className="text-gray-300 hover:text-emerald-300 cursor-pointer">
                      <Hash className="w-4 h-4 mr-2 text-pink-400" />
                      BRANDNAME.AI
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dashboard Link */}
              <Link href="/dashboard" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                Dashboard
              </Link>

              {/* System Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                    System
                    <ChevronDown className="ml-1 w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="bg-black/90 backdrop-blur-xl border-emerald-500/40 min-w-[180px]"
                >
                  <DropdownMenuLabel className="text-emerald-300 font-mono text-xs">ADMINISTRATION</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/api-keys" className="text-gray-300 hover:text-emerald-300 cursor-pointer">
                      <Key className="w-4 h-4 mr-2 text-yellow-400" />
                      API Keys
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-emerald-300 cursor-pointer">
                    <BarChart3 className="w-4 h-4 mr-2 text-blue-400" />
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-emerald-300 cursor-pointer">
                    <Database className="w-4 h-4 mr-2 text-green-400" />
                    System Logs
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-emerald-500/20" />

                  <DropdownMenuLabel className="text-emerald-300 font-mono text-xs">STATUS</DropdownMenuLabel>
                  <DropdownMenuItem className="text-gray-300 hover:text-emerald-300 cursor-pointer">
                    <Cpu className="w-4 h-4 mr-2 text-emerald-400" />
                    System Health
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-emerald-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">SYSTEM ONLINE</span>
              </div>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25">
                  Access Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Badge className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 text-emerald-300 px-4 py-2">
              <Cpu className="w-4 h-4 mr-2" />
              AI-POWERED DESIGN SYSTEM v2.1
            </Badge>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
              BRANDFORGE
            </span>
            <br />
            <span className="text-gray-200 text-3xl md:text-5xl">Internal Design Engine</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Advanced AI-powered design generation system for internal agency operations. Generate professional logos,
            banners, posters, slogans, and complete brand identities with enterprise-grade precision and speed.
          </p>
          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-black/60 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-emerald-400">99.9%</div>
                    <div className="text-gray-400 text-sm">System Uptime</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-teal-400">2.3s</div>
                    <div className="text-gray-400 text-sm">Avg Generation</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-400">∞</div>
                    <div className="text-gray-400 text-sm">Daily Limit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Generation Modules */}
      <section id="generators" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                AI GENERATION MODULES
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Complete suite of AI engines for professional brand asset creation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Logo Generator Module */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-emerald-800/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>

              <Card className="relative bg-black/80 backdrop-blur-xl border border-emerald-500/40 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 group-hover:scale-105 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent"></div>

                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div
                    className="w-full h-full bg-gradient-to-br from-emerald-400 to-transparent"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)",
                    }}
                  ></div>
                </div>

                <CardHeader className="relative z-10 text-center pb-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    <Palette className="w-10 h-10 text-white relative z-10" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">LOGO.AI</CardTitle>
                  <div className="text-emerald-400 text-sm font-mono mb-4">MODULE_001</div>
                  <CardDescription className="text-gray-300 text-lg">
                    Vector logo generation with advanced AI algorithms. Scalable SVG output optimized for brand identity
                    systems.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 font-mono text-sm">Vector SVG Output</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-100"></div>
                      <span className="text-gray-300 font-mono text-sm">Brand Style Analysis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-200"></div>
                      <span className="text-gray-300 font-mono text-sm">Color Palette Generation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-300"></div>
                      <span className="text-gray-300 font-mono text-sm">Instant Export</span>
                    </div>
                  </div>
                  <Link href="/generate/logo">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 font-mono">
                      INITIALIZE LOGO.AI
                      <Sparkles className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Banner Generator Module */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/30 to-cyan-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>

              <Card className="relative bg-black/80 backdrop-blur-xl border border-teal-500/40 shadow-2xl hover:shadow-teal-500/20 transition-all duration-500 group-hover:scale-105 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent"></div>

                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div
                    className="w-full h-full bg-gradient-to-br from-teal-400 to-transparent"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)",
                    }}
                  ></div>
                </div>

                <CardHeader className="relative z-10 text-center pb-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:shadow-teal-500/40 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    <Target className="w-10 h-10 text-white relative z-10" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">BANNER.AI</CardTitle>
                  <div className="text-teal-400 text-sm font-mono mb-4">MODULE_002</div>
                  <CardDescription className="text-gray-300 text-lg">
                    Multi-format banner generation for digital campaigns. Optimized for web, social, and advertising
                    platforms.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 font-mono text-sm">Multi-Platform Sizing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-100"></div>
                      <span className="text-gray-300 font-mono text-sm">Campaign Optimization</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-200"></div>
                      <span className="text-gray-300 font-mono text-sm">HD Export Quality</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-300"></div>
                      <span className="text-gray-300 font-mono text-sm">Brand Consistency</span>
                    </div>
                  </div>
                  <Link href="/generate/banner">
                    <Button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 font-mono">
                      INITIALIZE BANNER.AI
                      <Zap className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Poster Generator Module */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 to-lime-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>

              <Card className="relative bg-black/80 backdrop-blur-xl border border-green-500/40 shadow-2xl hover:shadow-green-500/20 transition-all duration-500 group-hover:scale-105 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent"></div>

                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div
                    className="w-full h-full bg-gradient-to-br from-green-400 to-transparent"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)",
                    }}
                  ></div>
                </div>

                <CardHeader className="relative z-10 text-center pb-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-lime-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:shadow-green-500/40 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    <TrendingUp className="w-10 h-10 text-white relative z-10" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">POSTER.AI</CardTitle>
                  <div className="text-green-400 text-sm font-mono mb-4">MODULE_003</div>
                  <CardDescription className="text-gray-300 text-lg">
                    Large format poster creation with print-ready specifications. Event and promotional material
                    generation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 font-mono text-sm">Print-Ready Quality</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-100"></div>
                      <span className="text-gray-300 font-mono text-sm">Typography Integration</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-200"></div>
                      <span className="text-gray-300 font-mono text-sm">Format Flexibility</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
                      <span className="text-gray-300 font-mono text-sm">Event Optimization</span>
                    </div>
                  </div>
                  <Link href="/generate/poster">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 font-mono">
                      INITIALIZE POSTER.AI
                      <TrendingUp className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Slogan Generator Module */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-violet-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>

              <Card className="relative bg-black/80 backdrop-blur-xl border border-purple-500/40 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 group-hover:scale-105 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent"></div>

                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div
                    className="w-full h-full bg-gradient-to-br from-purple-400 to-transparent"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)",
                    }}
                  ></div>
                </div>

                <CardHeader className="relative z-10 text-center pb-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    <MessageSquare className="w-10 h-10 text-white relative z-10" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">SLOGAN.AI</CardTitle>
                  <div className="text-purple-400 text-sm font-mono mb-4">MODULE_004</div>
                  <CardDescription className="text-gray-300 text-lg">
                    Intelligent slogan and catchphrase generation. Create memorable brand messaging with AI-powered
                    creativity.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 font-mono text-sm">Brand Voice Analysis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                      <span className="text-gray-300 font-mono text-sm">Multiple Variations</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                      <span className="text-gray-300 font-mono text-sm">Tone Customization</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>
                      <span className="text-gray-300 font-mono text-sm">Market Testing</span>
                    </div>
                  </div>
                  <Link href="/generate/slogan">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 font-mono">
                      INITIALIZE SLOGAN.AI
                      <MessageSquare className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Tagline Generator Module */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 to-amber-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>

              <Card className="relative bg-black/80 backdrop-blur-xl border border-orange-500/40 shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 group-hover:scale-105 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent"></div>

                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div
                    className="w-full h-full bg-gradient-to-br from-orange-400 to-transparent"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)",
                    }}
                  ></div>
                </div>

                <CardHeader className="relative z-10 text-center pb-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:shadow-orange-500/40 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    <Type className="w-10 h-10 text-white relative z-10" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">TAGLINE.AI</CardTitle>
                  <div className="text-orange-400 text-sm font-mono mb-4">MODULE_005</div>
                  <CardDescription className="text-gray-300 text-lg">
                    Professional tagline creation for brand positioning. Generate compelling one-liners that capture
                    brand essence.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 font-mono text-sm">Brand Positioning</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-100"></div>
                      <span className="text-gray-300 font-mono text-sm">Emotional Resonance</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-200"></div>
                      <span className="text-gray-300 font-mono text-sm">Memorable Phrasing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-300"></div>
                      <span className="text-gray-300 font-mono text-sm">Industry Alignment</span>
                    </div>
                  </div>
                  <Link href="/generate/tagline">
                    <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 font-mono">
                      INITIALIZE TAGLINE.AI
                      <Type className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Brand Name Generator Module */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/30 to-rose-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>

              <Card className="relative bg-black/80 backdrop-blur-xl border border-pink-500/40 shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 group-hover:scale-105 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent"></div>

                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div
                    className="w-full h-full bg-gradient-to-br from-pink-400 to-transparent"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)",
                    }}
                  ></div>
                </div>

                <CardHeader className="relative z-10 text-center pb-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:shadow-pink-500/40 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    <Hash className="w-10 h-10 text-white relative z-10" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">BRANDNAME.AI</CardTitle>
                  <div className="text-pink-400 text-sm font-mono mb-4">MODULE_006</div>
                  <CardDescription className="text-gray-300 text-lg">
                    Intelligent brand name generation with domain availability checking. Create unique, memorable brand
                    identities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 font-mono text-sm">Domain Availability</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-100"></div>
                      <span className="text-gray-300 font-mono text-sm">Trademark Screening</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200"></div>
                      <span className="text-gray-300 font-mono text-sm">Linguistic Analysis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-300"></div>
                      <span className="text-gray-300 font-mono text-sm">Cultural Sensitivity</span>
                    </div>
                  </div>
                  <Link href="/generate/brandname">
                    <Button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300 font-mono">
                      INITIALIZE BRANDNAME.AI
                      <Hash className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-8 bg-black/80 backdrop-blur-xl border border-emerald-500/40 rounded-2xl px-8 py-6 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300 font-mono text-sm">SYSTEM OPERATIONAL</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse delay-200"></div>
                <span className="text-gray-300 font-mono text-sm">AI ENGINES ACTIVE</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-400"></div>
                <span className="text-gray-300 font-mono text-sm">UNLIMITED ACCESS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/50 to-teal-900/50"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              READY TO DEPLOY?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Access the full suite of AI generation tools. Internal system ready for immediate deployment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg px-8 py-3 shadow-lg shadow-emerald-500/25"
              >
                <Database className="mr-2 w-5 h-5" />
                Access Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/90 backdrop-blur-xl border-t border-emerald-500/30 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  BrandForge
                </span>
              </div>
              <p className="text-gray-400 font-mono text-sm">Internal AI Design Generation System v2.1</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-emerald-400">VISUAL MODULES</h3>
              <ul className="space-y-2 text-gray-400 font-mono text-sm">
                <li>
                  <Link href="/generate/logo" className="hover:text-emerald-400 transition-colors">
                    LOGO.AI
                  </Link>
                </li>
                <li>
                  <Link href="/generate/banner" className="hover:text-emerald-400 transition-colors">
                    BANNER.AI
                  </Link>
                </li>
                <li>
                  <Link href="/generate/poster" className="hover:text-emerald-400 transition-colors">
                    POSTER.AI
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-emerald-400">TEXT MODULES</h3>
              <ul className="space-y-2 text-gray-400 font-mono text-sm">
                <li>
                  <Link href="/generate/slogan" className="hover:text-emerald-400 transition-colors">
                    SLOGAN.AI
                  </Link>
                </li>
                <li>
                  <Link href="/generate/tagline" className="hover:text-emerald-400 transition-colors">
                    TAGLINE.AI
                  </Link>
                </li>
                <li>
                  <Link href="/generate/brandname" className="hover:text-emerald-400 transition-colors">
                    BRANDNAME.AI
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-emerald-400">SYSTEM</h3>
              <ul className="space-y-2 text-gray-400 font-mono text-sm">
                <li>
                  <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                    DASHBOARD
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    STATUS
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    LOGS
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    ADMIN
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-emerald-500/20 mt-8 pt-8 text-center">
            <p className="text-gray-400 font-mono text-sm">
              &copy; 2024 BrandForge Internal System. Authorized Personnel Only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
