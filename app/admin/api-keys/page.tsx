"use client"

import { useState, useEffect } from "react"
import { Key, Save, Eye, EyeOff, CheckCircle, XCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ApiKeyStatus {
  openai_configured: boolean
}

export default function ApiKeysPage() {
  const [openaiKey, setOpenaiKey] = useState("")
  const [showOpenaiKey, setShowOpenaiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [keyStatus, setKeyStatus] = useState<ApiKeyStatus>({ openai_configured: false })

  useEffect(() => {
    checkKeyStatus()
  }, [])

  const checkKeyStatus = async () => {
    try {
      const response = await fetch("/api/admin/api-keys")
      const data = await response.json()
      if (data.success) {
        setKeyStatus(data.keys)
      }
    } catch (error) {
      console.error("Failed to check key status:", error)
    }
  }

  const handleSaveKey = async (keyName: string, keyValue: string) => {
    if (!keyValue.trim()) {
      setMessage({ type: "error", text: "API key cannot be empty" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: keyName,
          value: keyValue.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: `${keyName} saved successfully!` })
        checkKeyStatus() // Refresh status

        // Clear the input field for security
        if (keyName === "openai_api_key") {
          setOpenaiKey("")
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save API key" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error occurred" })
    } finally {
      setIsLoading(false)
    }
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
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                BrandForge Admin
              </span>
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">ADMIN ONLY</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              API KEY MANAGEMENT
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
            Configure AI provider API keys for the BrandForge system
          </p>
        </div>

        {message && (
          <Alert
            className={`mb-6 ${message.type === "success" ? "border-green-500/40 bg-green-500/10" : "border-red-500/40 bg-red-500/10"}`}
          >
            <AlertDescription className={message.type === "success" ? "text-green-300" : "text-red-300"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* OpenAI API Key */}
          <Card className="bg-lime-glass-200 backdrop-blur-xl border border-lime-500/30 shadow-glass-lime">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-white">
                    <Key className="w-5 h-5 mr-2 text-emerald-400" />
                    OpenAI API Key
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-mono">
                    Required for GPT-4o text generation and DALL-E 3 image generation
                  </CardDescription>
                </div>
                <Badge
                  className={`font-mono ${
                    keyStatus.openai_configured
                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                      : "bg-red-500/20 text-red-300 border-red-500/30"
                  }`}
                >
                  {keyStatus.openai_configured ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      CONFIGURED
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      NOT SET
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key" className="text-gray-300 font-mono">
                  API KEY
                </Label>
                <div className="relative">
                  <Input
                    id="openai-key"
                    type={showOpenaiKey ? "text" : "password"}
                    placeholder="sk-..."
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    className="bg-gray-900/80 border-emerald-500/40 text-gray-200 placeholder-gray-400 pr-20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-12 top-0 h-full px-3 text-gray-400 hover:text-emerald-400"
                    onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                  >
                    {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-emerald-400 hover:text-emerald-300"
                    onClick={() => handleSaveKey("openai_api_key", openaiKey)}
                    disabled={isLoading || !openaiKey.trim()}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                Get your API key from{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  platform.openai.com/api-keys
                </a>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-lime-glass-200 backdrop-blur-xl border border-lime-500/30 shadow-glass-lime">
            <CardHeader>
              <CardTitle className="text-white">SYSTEM STATUS</CardTitle>
              <CardDescription className="text-gray-400 font-mono">Current AI generation capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-mono text-sm">LOGO GENERATION</span>
                    <Badge
                      className={`text-xs font-mono ${
                        keyStatus.openai_configured
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      }`}
                    >
                      {keyStatus.openai_configured ? "ACTIVE" : "OFFLINE"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-mono text-sm">IMAGE GENERATION</span>
                    <Badge
                      className={`text-xs font-mono ${
                        keyStatus.openai_configured
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      }`}
                    >
                      {keyStatus.openai_configured ? "ACTIVE" : "OFFLINE"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-mono text-sm">TEXT GENERATION</span>
                    <Badge
                      className={`text-xs font-mono ${
                        keyStatus.openai_configured
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      }`}
                    >
                      {keyStatus.openai_configured ? "ACTIVE" : "OFFLINE"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-mono text-sm">PROMPT ENHANCEMENT</span>
                    <Badge
                      className={`text-xs font-mono ${
                        keyStatus.openai_configured
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      }`}
                    >
                      {keyStatus.openai_configured ? "ACTIVE" : "OFFLINE"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="mt-8 bg-black/80 backdrop-blur-xl border border-yellow-500/40">
          <CardHeader>
            <CardTitle className="text-yellow-400">🔒 SECURITY NOTICE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• API keys are stored securely in Supabase with Row Level Security (RLS)</p>
              <p>• Only service role has access to the secrets table</p>
              <p>• Keys are never exposed to client-side code</p>
              <p>• All OpenAI API calls are made server-side for maximum security</p>
              <p>• Consider rotating your API keys regularly for best security practices</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
