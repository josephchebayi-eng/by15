import { generateImage, checkProviderAvailability } from "@/lib/ai-providers"

// ✅ Properly typed request interface
interface LogoRequest {
  prompt: string
  provider: "openai" | "flux"
  style?: string
  colors?: string
  industry?: string
}

export async function POST(req: Request) {
  try {
    const { prompt, provider, style, colors, industry }: LogoRequest = await req.json()

    if (!prompt || !prompt.trim()) {
      return Response.json(
        { success: false, error: "Prompt is required" }, 
        { status: 400 }
      )
    }

    if (!provider || (provider !== "openai" && provider !== "flux")) {
      return Response.json(
        {
          success: false,
          error: "Valid provider (openai or flux) is required",
        },
        { status: 400 }
      )
    }

    // Check if the selected provider is available
    const availability = await checkProviderAvailability()
    if ((provider === "openai" && !availability.openai) || (provider === "flux" && !availability.flux)) {
      return Response.json(
        {
          success: false,
          error: `${provider.toUpperCase()} API key not configured. Please set up API key in the admin panel.`,
          needsConfiguration: true,
        },
        { status: 503 }
      )
    }

    // Prepare additional context for prompt enhancement
    const additionalContext = {
      style: style || "modern",
      colors: colors || "professional",
      industry: industry || "business",
      type: "logo",
      purpose: "brand identity and recognition",
    }

    try {
      const result = await generateImage(
        provider,
        prompt,
        "1024x1024",
        "logo",
        additionalContext
      )

      return Response.json({
        success: true,
        imageUrl: result.imageUrl,
        prompt: result.enhancedPrompt,
        provider: result.usedProvider,
        model: result.model,
        promptEnhanced: result.promptEnhanced,
        message: `Logo generated using ${result.usedProvider.toUpperCase()}${result.model ? ` (${result.model})` : ""}`,
      })
    } catch (error) {
      console.error("❌ Logo generation error:", error)
      const errorMessage = error instanceof Error ? error.message : "Logo generation failed."
      
      return Response.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 500 }
      )
    }
  } catch (error: unknown) {
    console.error("❌ Logo generation error:", error)
    const errorMessage = error instanceof Error ? error.message : "Image generation failed."
    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}