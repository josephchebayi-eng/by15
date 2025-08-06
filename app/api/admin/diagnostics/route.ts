import { checkProviderAvailability } from "@/lib/ai-providers"
import { getApiKeys } from "@/lib/api-keys"

export async function GET() {
  try {
    console.log("🔍 Running system diagnostics...")

    // Check provider availability
    const availability = await checkProviderAvailability()

    // Test Flux AI connection if key is available
    let fluxTest = null
    if (availability.flux) {
      // TODO: Implement Flux AI connection test
      fluxTest = { success: false, message: "Flux AI test not yet implemented" }
    }

    // Get API keys for additional validation
    const keys = await getApiKeys()

    interface DiagnosticsData {
      timestamp: string;
      providers: {
        openai: {
          configured: boolean;
          keyFormat: string;
          keyLength: number;
        };
        flux: {
          configured: boolean;
          keyFormat: string;
          keyLength: number;
          connectionTest: any; // TODO: Add proper type for connection test
        };
      };
      environment: {
        nodeEnv: string | undefined;
        siteUrl: string | undefined;
        supabaseConfigured: boolean;
      };
      recommendations: string[];
    }

    const diagnostics: DiagnosticsData = {
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
        flux: {
          configured: availability.flux,
          keyFormat: keys.flux_api_key
            ? keys.flux_api_key.startsWith("sk-")
              ? "✅ Valid format"
              : "⚠️ Unexpected format"
            : "❌ Not configured",
          keyLength: keys.flux_api_key?.length || 0,
          connectionTest: fluxTest,
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
    if (!availability.openai && !availability.flux) {
      diagnostics.recommendations.push("❌ No AI providers configured. Please add API keys in the admin panel.")
    }

    if (availability.flux && keys.flux_api_key && !keys.flux_api_key.startsWith("sk-")) {
      diagnostics.recommendations.push(
        "⚠️ Flux AI API key format appears incorrect. Keys should start with 'sk-'"
      )
    }

    if (fluxTest && !fluxTest.success) {
      diagnostics.recommendations.push(`❌ Flux AI connection test failed: ${fluxTest.message || 'Unknown error'}`)
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
