import { generateImageWithFallback, generateDesignWithEnhancement, checkProviderAvailability } from "@/lib/ai-providers"

export async function POST(req: Request) {
  try {
    const { prompt, size, style, colors, text: posterText, provider = "openai" } = await req.json()

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

    // Prepare additional context for enhanced prompt generation
    const additionalContext = {
      size,
      style,
      colors,
      text: posterText,
      type: "poster",
      purpose: "marketing and advertising",
    }

    let imageUrl: string
    let usedProvider: string
    let fallbackUsed: boolean
    let model: string | undefined
    let isPlaceholder = false
    let description: string | undefined
    let enhancedPrompt: string | undefined

    try {
      // Always try image generation first if OpenAI is available
      if (availability.openai) {
        console.log("🎨 Attempting poster image generation with enhanced prompt...")
        const result = await generateImageWithFallback(prompt, "1024x1792", "poster", additionalContext)
        imageUrl = result.imageUrl
        usedProvider = result.usedProvider
        fallbackUsed = result.fallbackUsed
        isPlaceholder = result.isPlaceholder || false
        description = result.description
        enhancedPrompt = result.enhancedPrompt
      } else {
        console.log("🎨 OpenAI not available, generating enhanced visual description with OpenRouter...")

        // Generate detailed description for poster using design-focused enhancement
        const systemPrompt = `You are a world-class poster designer with expertise in visual communication, typography, and print design. Create comprehensive visual descriptions that could be used by a designer to create professional posters.

        Focus on:
        - Visual hierarchy and composition
        - Typography and text treatment
        - Color psychology and impact
        - Print production requirements
        - Marketing effectiveness
        - Brand consistency`

        const result = await generateDesignWithEnhancement(
          prompt,
          "poster",
          additionalContext,
          systemPrompt,
          "openrouter",
        )

        imageUrl = `/placeholder.svg?height=600&width=400&text=${encodeURIComponent("AI-Generated Poster Design")}`
        usedProvider = result.usedProvider
        fallbackUsed = result.fallbackUsed
        model = result.model
        isPlaceholder = true
        description = result.text
        enhancedPrompt = result.enhancedPrompt
      }
    } catch (aiError) {
      console.error("❌ AI generation failed:", aiError)

      // Create a helpful error message based on the error type
      const errorMessage = aiError instanceof Error ? aiError.message : "Unknown error"

      if (errorMessage.includes("quota") || errorMessage.includes("billing")) {
        return Response.json(
          {
            success: false,
            error: "OpenAI quota exceeded. Please check your billing settings or try again later.",
            details: "Your OpenAI account has reached its billing limit. Please add credits or upgrade your plan.",
          },
          { status: 402 }, // Payment Required
        )
      }

      return Response.json(
        {
          success: false,
          error: "AI generation service temporarily unavailable. Please try again later.",
          details: errorMessage,
        },
        { status: 503 },
      )
    }

    // Prepare response based on whether we have a real image or placeholder
    const response: any = {
      success: true,
      imageUrl,
      prompt: enhancedPrompt || prompt,
      provider: usedProvider,
      model,
      fallbackUsed,
      isPlaceholder,
      promptEnhanced: !!enhancedPrompt,
    }

    if (isPlaceholder && description) {
      response.description = description
      response.message = `Generated comprehensive design brief using ${usedProvider}${model ? ` (${model})` : ""} - Use this detailed description to create your poster`
    } else {
      response.message = fallbackUsed
        ? `Generated using ${usedProvider}${model ? ` (${model})` : ""} with enhanced design prompt`
        : `Generated using ${usedProvider}${model ? ` (${model})` : ""} with enhanced design prompt`
    }

    return Response.json(response)
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
