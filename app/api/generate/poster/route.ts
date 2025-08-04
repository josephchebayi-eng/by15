import { generateImage, checkProviderAvailability } from "@/lib/ai-providers"

export async function POST(req: Request) {
  try {
    const { prompt, provider, size, style, colors, text: posterText } = await req.json()

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
        { status: 503 },
      )
    }

    // Prepare additional context for enhanced prompt generation
    const additionalContext = {
      size,
      style: style || "modern",
      colors: colors || "vibrant",
      text: posterText,
      type: "poster",
      purpose: "marketing and advertising",
    }

    try {
      const result = await generateImage(
        provider,
        prompt,
        "1024x1792",
        "poster",
        additionalContext
      )

      return Response.json({
        success: true,
        imageUrl: result.imageUrl,
        prompt: result.enhancedPrompt,
        provider: result.usedProvider,
        model: result.model,
        promptEnhanced: result.promptEnhanced,
        message: `Poster generated using ${result.usedProvider.toUpperCase()}${result.model ? ` (${result.model})` : ""}`,
      })
    } catch (error) {
      console.error("❌ Poster generation error:", error)
      const errorMessage = error instanceof Error ? error.message : "Poster generation failed."
      return Response.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Poster generation error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate poster",
      },
      { status: 500 },
    )
  }
}
