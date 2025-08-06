import { generateImageWithFallback, checkProviderAvailability } from "@/lib/ai-providers"

interface GenerateBannerRequest {
  prompt: string
  dimensions: string
  style: string
  colors: string
  provider?: 'openai' | 'flux'
  enhancePrompt?: boolean
}

async function enhancePromptForImage(prompt: string, style: string, colors: string): Promise<string> {
  return `Create a professional banner design: ${prompt}. 
  Style: ${style}. 
  Colors: ${colors}.
  High-quality, modern design suitable for marketing and branding. 
  Professional layout with clear typography and visual hierarchy.`
}

export async function POST(req: Request) {
  try {
    const { prompt, dimensions, style, colors, provider = 'openai', enhancePrompt = true }: GenerateBannerRequest = await req.json()

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

    let imageUrl: string
    let usedProvider = provider
    let fallbackUsed = false
    let model = provider === 'openai' ? 'dall-e-3' : 'stability-ai/sdxl'

    try {
      const imageSize = dimensions.includes("1920x1080") ? "1792x1024" : "1024x1024"
      
      // Generate image with the selected provider
      const enhancedPrompt = enhancePrompt ? await enhancePromptForImage(prompt, style, colors) : prompt
      const result = await generateImageWithFallback(
        enhancedPrompt,
        imageSize,
        "banner"
      )
      
      imageUrl = result.imageUrl
      usedProvider = result.usedProvider
      fallbackUsed = result.fallbackUsed
      
      // Update model based on the actual provider used
      model = usedProvider === "openai" ? "dall-e-3" : 
              usedProvider === "flux" ? "stability-ai/sdxl" : 
              "unknown"

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
      prompt: enhancePrompt ? await enhancePromptForImage(prompt, style, colors) : prompt,
      provider: usedProvider,
      model,
      fallbackUsed,
      message: fallbackUsed
        ? `Generated using fallback provider: ${usedProvider}${model ? ` (${model})` : ""}`
        : `Generated using ${usedProvider}${model ? ` (${model})` : ""}`,
      promptEnhanced: enhancePrompt
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
