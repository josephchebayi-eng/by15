import { generateImageWithFallback, generateWithFallback, checkProviderAvailability } from "@/lib/ai-providers"

export async function POST(req: Request) {
  try {
    const { prompt, dimensions, style, colors, provider = "openai" } = await req.json()

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
      if (provider === "openrouter" || !availability.openai) {
        // For OpenRouter, generate a detailed visual description
        const systemPrompt = `You are a professional banner designer with expertise in visual composition, typography, and marketing design. Create detailed visual descriptions for banner generation.`

        const result = await generateWithFallback(
          `Create a detailed visual description for this banner: ${enhancedPrompt}`,
          systemPrompt,
          "openrouter",
          "visual", // Use visual task type for banner descriptions
        )

        // Note: OpenRouter doesn't directly support image generation
        imageUrl = `/placeholder.svg?height=400&width=800&text=${encodeURIComponent(result.text.substring(0, 100))}`
        usedProvider = result.usedProvider
        fallbackUsed = result.fallbackUsed
        model = result.model
      } else {
        // Use OpenAI DALL-E for image generation
        const imageSize = dimensions.includes("1920x1080") ? "1792x1024" : "1024x1024"
        const result = await generateImageWithFallback(enhancedPrompt, imageSize)
        imageUrl = result.imageUrl
        usedProvider = result.usedProvider
        fallbackUsed = result.fallbackUsed
      }
    } catch (aiError) {
      console.error("All AI providers failed:", aiError)

      return Response.json(
        {
          success: false,
          error: "AI generation service temporarily unavailable. All providers failed. Please try again later.",
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
        ? `Generated using ${usedProvider}${model ? ` (${model})` : ""} - visual design AI`
        : `Generated using ${usedProvider}${model ? ` (${model})` : ""} - visual design AI`,
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
