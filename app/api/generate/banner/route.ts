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
      // Use OpenAI DALL-E for image generation
      const imageSize = dimensions.includes("1920x1080") ? "1792x1024" : "1024x1024"
      const result = await generateImageWithFallback(enhancedPrompt, imageSize, "banner")
      imageUrl = result.imageUrl
      usedProvider = result.usedProvider
      fallbackUsed = result.fallbackUsed
      model = result.model
    } catch (aiError) {
      console.error("OpenAI generation failed:", aiError)

      return Response.json(
        {
          success: false,
          error: "AI generation service temporarily unavailable. Please try again later.",
        },
        { status: 503 },
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
