import { generateImageWithFallback, generateWithFallback, checkProviderAvailability } from "@/lib/ai-providers"

export async function POST(req: Request) {
  try {
    const { prompt, dimensions, style, colors } = await req.json()

    // Check if any providers are available
    const availability = await checkProviderAvailability()
    if (!availability.hasAnyProvider) {
      return Response.json(
        {
          success: false,
          error: "No AI providers configured. Please set up API keys in the admin panel.",
        },
        { status: 503 },
      )
    }

    const enhancedPrompt = `Create a professional banner design: ${prompt}. 
    Dimensions: ${dimensions}. 
    Style: ${style}. 
    Colors: ${colors}. 
    High-quality, modern design suitable for marketing and branding. 
    Professional layout with clear typography and visual hierarchy.`

    let imageUrl: string
    let usedProvider: string
    let fallbackUsed: boolean
    let model: string | undefined

    try {
      // Generate image with automatic fallback
      const imageSize = dimensions.includes("1920x1080") ? "1792x1024" : "1024x1024"
      const result = await generateImageWithFallback(enhancedPrompt, imageSize, "banner")
      imageUrl = result.imageUrl
      usedProvider = result.usedProvider
      fallbackUsed = result.fallbackUsed
      
      // Set model based on provider
      model = usedProvider === "openai" ? "dall-e-3" : 
              usedProvider === "flux" ? "stability-ai/sdxl" : 
              "unknown"

      // Log which provider was used
      console.log(`✅ Generated banner using ${usedProvider}${fallbackUsed ? ' (fallback)' : ''}`)
      if (fallbackUsed) {
        console.log("⚠️ Primary provider failed, used fallback provider")
      }
    } catch (aiError) {
      console.error("Banner generation failed:", aiError)
      
      let errorMessage = "AI generation service temporarily unavailable. Please try again later."
      let statusCode = 503
      let needsConfiguration = false
      let quotaExceeded = false
      
      // Handle specific error cases
      if (aiError instanceof Error) {
        if (aiError.message === "QUOTA_EXCEEDED") {
          errorMessage = "API quota exceeded. Please check your API key limits or try again later."
          quotaExceeded = true
        } else if (aiError.message.includes("API key")) {
          errorMessage = "API key not configured. Please set up your API keys in the admin panel."
          needsConfiguration = true
          statusCode = 400
        }
      }

      return Response.json(
        {
          success: false,
          error: errorMessage,
          needsConfiguration,
          quotaExceeded,
        },
        { status: statusCode },
      )
    }

    return Response.json({
      success: true,
      imageUrl,
      prompt: enhancedPrompt,
      provider: usedProvider,
      model,
      fallbackUsed,
      message: fallbackUsed
        ? `Generated using ${usedProvider}${model ? ` (${model})` : ""} with fallback`
        : `Generated using ${usedProvider}${model ? ` (${model})` : ""}`,
    })
  } catch (error) {
    console.error("Banner generation error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate banner",
      },
      { status: 500 },
    )
  }
}
