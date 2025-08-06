"use client"

import { useState, useEffect } from "react"
import {
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Zap,
  Clock,
  Server,
  ArrowLeft,
  Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface TestResult {
  status: "success" | "error"
  responseTime?: number
  provider?: string
  model?: string
  fallbackUsed?: boolean
  promptEnhanced?: boolean
  responseLength?: number
  preview?: string
  error?: string
}

interface DiagnosticsData {
  success: boolean
  summary: {
    totalTests: number
    successCount: number
    failureCount: number
    successRate: string
  }
  availability: {
    openai: boolean
    flux: boolean
    hasAnyProvider: boolean
    diagnostics: {
      openai: string
      flux: string
    }
  }
  fluxTest: {
    success: boolean
    error?: string
    availableModels?: string[]
  }
  moduleTests: Record<string, TestResult>
  timestamp: string
}

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/diagnostics")
      const data = await response.json()

      if (data.success) {
        setDiagnostics(data)
      } else {
        setError(data.error || "Diagnostics failed")
      }
    } catch (err) {
      setError("Failed to run diagnostics")
      console.error("Diagnostics error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">SUCCESS</Badge>
      case "error":
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">ERROR</Badge>
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">WARNING</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
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
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">ADMIN DIAGNOSTICS</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={runDiagnostics}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4 mr-2" />
                    Run Diagnostics
                  </>
                )}
              </Button>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-300 hover:text-emerald-400">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              SYSTEM DIAGNOSTICS
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
            Comprehensive AI module testing and performance monitoring
          </p>
        </div>

        {error && (
          <Card className="mb-8 bg-red-500/20 border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="w-6 h-6 text-red-400 mr-3" />
                <div>
                  <h3 className="text-red-300 font-semibold">Diagnostics Failed</h3>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {diagnostics && (
          <>
            {/* Summary */}
            <Card className="mb-8 bg-lime-glass-200 backdrop-blur-xl border border-lime-500/30 shadow-glass-lime">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-emerald-400" />
                  TEST SUMMARY
                </CardTitle>
                <CardDescription className="text-gray-400 font-mono">
                  Overall system health and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-2">{diagnostics.summary.successCount}</div>
                    <div className="text-sm text-gray-400 font-mono">MODULES WORKING</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400 mb-2">{diagnostics.summary.failureCount}</div>
                    <div className="text-sm text-gray-400 font-mono">MODULES FAILED</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">{diagnostics.summary.successRate}</div>
                    <div className="text-sm text-gray-400 font-mono">SUCCESS RATE</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">{diagnostics.summary.totalTests}</div>
                    <div className="text-sm text-gray-400 font-mono">TOTAL TESTS</div>
                  </div>
                </div>
                <div className="mt-6">
                  <Progress
                    value={(diagnostics.summary.successCount / diagnostics.summary.totalTests) * 100}
                    className="h-3"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Provider Status */}
            <Card className="mb-8 bg-lime-glass-200 backdrop-blur-xl border border-lime-500/30 shadow-glass-lime">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Server className="w-5 h-5 mr-2 text-emerald-400" />
                  PROVIDER STATUS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-emerald-400 font-mono mb-3">AVAILABILITY</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">OpenAI</span>
                        {diagnostics.availability.openai ? (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">AVAILABLE</Badge>
                        ) : (
                          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">UNAVAILABLE</Badge>
                        )}
                      </div>

                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-400 font-mono mb-3">DIAGNOSTICS</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">OpenAI:</span>
                        <span className="text-gray-300 ml-2">{diagnostics.availability.diagnostics.openai}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">OpenRouter:</span>
                        <span className="text-gray-300 ml-2">{diagnostics.availability.diagnostics.openrouter}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Module Tests */}
            <Card className="bg-lime-glass-200 backdrop-blur-xl border border-lime-500/30 shadow-glass-lime">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-emerald-400" />
                  MODULE TESTS
                </CardTitle>
                <CardDescription className="text-gray-400 font-mono">
                  Individual AI module performance and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(diagnostics.moduleTests).map(([moduleName, result]) => (
                    <Card key={moduleName} className="bg-lime-glass-100 border border-lime-500/20 shadow-glass-lime">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            {getStatusIcon(result.status)}
                            <span className="text-white font-semibold ml-2 uppercase">{moduleName}</span>
                          </div>
                          {getStatusBadge(result.status)}
                        </div>

                        {result.status === "success" ? (
                          <div className="space-y-2 text-sm">
                            {result.responseTime && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Response Time
                                </span>
                                <span className="text-emerald-400 font-mono">{result.responseTime}ms</span>
                              </div>
                            )}
                            {result.provider && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Provider</span>
                                <span className="text-blue-400 font-mono">{result.provider}</span>
                              </div>
                            )}
                            {result.model && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Model</span>
                                <span className="text-purple-400 font-mono text-xs">{result.model}</span>
                              </div>
                            )}
                            {result.fallbackUsed && (
                              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                                FALLBACK USED
                              </Badge>
                            )}
                            {result.promptEnhanced && (
                              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                                PROMPT ENHANCED
                              </Badge>
                            )}
                            {result.preview && (
                              <div className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300">{result.preview}</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-red-300 text-sm">{result.error}</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 text-center text-gray-400 text-sm font-mono">
              Last updated: {new Date(diagnostics.timestamp).toLocaleString()}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
