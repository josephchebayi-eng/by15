'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
  Palette,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  ChevronDown,
  Target,
  TrendingUp,
  MessageSquare,
  Type,
  Hash,
  CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ModernNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) return null

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'backdrop-blur-xl bg-slate-950/90 border-b border-slate-700/50 shadow-lg shadow-slate-900/20'
        : 'backdrop-blur-sm bg-slate-950/20'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${
          isScrolled ? 'h-14' : 'h-16'
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-all duration-300 group-hover:scale-105">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              BrandForge
            </span>
            <div className="px-2 py-1 bg-emerald-500/20 rounded-md">
              <span className="text-xs font-medium text-emerald-400">PRO</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm font-medium">
                  AI Tools
                  <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 min-w-[220px]"
              >
                <DropdownMenuLabel className="text-emerald-400 font-medium text-xs">
                  VISUAL GENERATION
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/generate/logo" className="text-gray-300 hover:text-blue-300 cursor-pointer">
                    <Palette className="w-4 h-4 mr-3 text-blue-400" />
                    Logo Generator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/generate/banner" className="text-gray-300 hover:text-blue-300 cursor-pointer">
                    <Target className="w-4 h-4 mr-3 text-indigo-400" />
                    Banner Creator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/generate/poster" className="text-gray-300 hover:text-blue-300 cursor-pointer">
                    <TrendingUp className="w-4 h-4 mr-3 text-purple-400" />
                    Poster Designer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/generate/businesscard" className="text-gray-300 hover:text-blue-300 cursor-pointer">
                    <CreditCard className="w-4 h-4 mr-3 text-pink-400" />
                    Business Card Designer
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-blue-500/20" />

                <DropdownMenuLabel className="text-blue-300 font-mono text-xs">
                  TEXT GENERATION
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/generate/slogan" className="text-gray-300 hover:text-blue-300 cursor-pointer">
                    <MessageSquare className="w-4 h-4 mr-3 text-cyan-400" />
                    Slogan Wizard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/generate/tagline" className="text-gray-300 hover:text-blue-300 cursor-pointer">
                    <Type className="w-4 h-4 mr-3 text-violet-400" />
                    Tagline Maker
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/generate/brandname" className="text-gray-300 hover:text-blue-300 cursor-pointer">
                    <Hash className="w-4 h-4 mr-3 text-fuchsia-400" />
                    Brand Namer
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/dashboard" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm font-medium">
              Dashboard
            </Link>

            <Link href="#showcase" className="text-slate-300 hover:text-emerald-400 transition-colors text-sm font-medium">
              Portfolio
            </Link>
          </div>

          {/* Right Side - Theme Toggle & CTA */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-slate-300 hover:text-emerald-400 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* CTA Button */}
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-300 hover:text-blue-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-500/30 bg-black/90 backdrop-blur-xl">
            <div className="px-4 py-6 space-y-4">
              <div className="space-y-3">
                <div className="text-blue-300 font-mono text-xs uppercase tracking-wider">AI Tools</div>
                <Link
                  href="/generate/logo"
                  className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Palette className="w-4 h-4" />
                  <span>Logo Generator</span>
                </Link>
                <Link
                  href="/generate/banner"
                  className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Target className="w-4 h-4" />
                  <span>Banner Creator</span>
                </Link>
                <Link
                  href="/generate/poster"
                  className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Poster Designer</span>
                </Link>
                <Link
                  href="/generate/businesscard"
                  className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Business Card Designer</span>
                </Link>
                <Link
                  href="/generate/slogan"
                  className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Slogan Wizard</span>
                </Link>
              </div>

              <div className="border-t border-blue-500/20 pt-4">
                <Link
                  href="/dashboard"
                  className="block text-gray-300 hover:text-blue-400 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="#showcase"
                  className="block text-gray-300 hover:text-blue-400 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Examples
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
