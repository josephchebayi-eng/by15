import { checkProviderAvailability, testOpenRouterConnection } from "@/lib/ai-providers"
import { getApiKeys } from "@/lib/api-keys"

export async function GET() {
  try {
    console.log("🔍 Running system diagnostics...")

    // Check provider availability
    const availability = await checkProviderAvailability()

    // Test OpenRouter connection if key is available
    let openrouterTest = null
    if (availability.openrouter) {
      openrouterTest = await testOpenRouterConnection()
    }

    // Get API keys for additional validation
    const keys = await getApiKeys()

    const diagnostics = {
      timestamp: new Date().toISOString(),
      providers: {
        openai: {
          configured: availability.openai,
          keyFormat: keys.openai_api_key
            ? keys.openai_api_key.startsWith("sk-")
              ? "✅ Valid format"
              : "⚠️ Unexpected format"
            : "❌ Not configured",
          keyLength: keys.openai_api_key?.length || 0,
        },
        openrouter: {
          configured: availability.openrouter,
          keyFormat: keys.openrouter_api_key
            ? keys.openrouter_api_key.startsWith("sk-or-")
              ? "✅ Valid format"
              : "⚠️ Should start with 'sk-or-'"
            : "❌ Not configured",
          keyLength: keys.openrouter_api_key?.length || 0,
          connectionTest: openrouterTest,
        },
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
        supabaseConfigured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      },
      recommendations: [],
    }

    // Generate recommendations
    if (!availability.openai && !availability.openrouter) {
      diagnostics.recommendations.push("❌ No AI providers configured. Please add API keys in the admin panel.")
    }

    if (availability.openrouter && keys.openrouter_api_key && !keys.openrouter_api_key.startsWith("sk-or-")) {
      diagnostics.recommendations.push(
        "⚠️ OpenRouter API key format appears incorrect. Keys should start with 'sk-or-'.",
      )
    }

    if (openrouterTest && !openrouterTest.success) {
      diagnostics.recommendations.push(`❌ OpenRouter connection failed: ${openrouterTest.error}`)
    }

    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      diagnostics.recommendations.push("⚠️ NEXT_PUBLIC_SITE_URL not set. This may cause issues with OpenRouter.")
    }

    return Response.json({
      success: true,
      diagnostics,
    })
  } catch (error) {
    console.error("❌ Diagnostics error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Diagnostics failed",
      },
      { status: 500 },
    )
  }
}
