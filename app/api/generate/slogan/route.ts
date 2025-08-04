import { generateDesignWithEnhancement, checkProviderAvailability } from "@/lib/ai-providers"

export async function POST(req: Request) {
  try {
    const { prompt, tone, industry, targetAudience } = await req.json()

    if (!prompt || !prompt.trim()) {
      return Response.json(
        {
          success: false,
          error: "Prompt is required",
        },
        { status: 400 },
      )
    }

    // Check if any providers are available
    const availability = await checkProviderAvailability()
    if (!availability.openai) {
      return Response.json(
        {
          success: false,
          error: "OpenAI API key not configured. Please set up API key in the admin panel.",
          needsConfiguration: true,
        },
        { status: 503 },
      )
    }

    // Prepare additional context for enhanced prompt generation
    const additionalContext = {
      tone,
      industry,
      targetAudience,
      type: "slogan",
      requirements: "memorable, catchy, brand-appropriate slogans",
    }

    try {
      console.log("🎨 Generating slogans with enhanced creative brief and quality checking...")

      const systemPrompt = `You are a world-class copywriter and brand strategist with 20+ years of experience creating memorable slogans for major brands. Create 8 unique, professional slogans that are:

      - Memorable and catchy with strong recall value
      - Appropriate for the brand's tone and industry
      - Resonant with the target audience
      - Unique and differentiated from competitors
      - Versatile across marketing channels
      - Concise and impactful (typically 2-7 words)
      - Emotionally engaging and brand-building

      Format your response as a numbered list of 8 slogans, each on a new line:
      1. [Slogan 1]
      2. [Slogan 2]
      ...and so on.

      Focus on creating slogans that build brand equity and drive business results.`

      const result = await generateDesignWithEnhancement(
        prompt,
        "slogan",
        additionalContext,
        systemPrompt,
        1, // Allow 1 regeneration for quality
      )

      // Parse slogans from the response
      const slogans = result.text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.match(/^\d+\./))
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((slogan) => slogan.length > 0)

      // Ensure we have at least some slogans
      if (slogans.length === 0) {
        throw new Error("No valid slogans found in response")
      }

      // Prepare response with quality assessment
      const response: any = {
        success: true,
        slogans,
        count: slogans.length,
        prompt: result.enhancedPrompt,
        provider: result.usedProvider,
        model: result.model,
        promptEnhanced: result.promptEnhanced,
        regenerationCount: result.regenerationCount,
        message: `Generated ${slogans.length} professional slogans using ${result.usedProvider}${result.model ? ` (${result.model})` : ""}${result.regenerationCount > 0 ? ` (${result.regenerationCount} regenerations for quality)` : ""}`,
      }

      // Include quality assessment if available
      if (result.qualityAssessment) {
        response.qualityAssessment = {
          score: result.qualityAssessment.score,
          meetsRequirements: result.qualityAssessment.meetsRequirements,
          feedback: result.qualityAssessment.feedback,
          strengths: result.qualityAssessment.strengths,
          improvements: result.qualityAssessment.improvements,
        }
      }

      return Response.json(response)
    } catch (aiError) {
      console.error("❌ Slogan generation failed:", aiError)

      const errorMessage = aiError instanceof Error ? aiError.message : "Unknown error"

      if (errorMessage.includes("quota") || errorMessage.includes("billing")) {
        return Response.json(
          {
            success: false,
            error: "OpenAI quota exceeded. Please check your billing settings or try again later.",
            quotaExceeded: true,
          },
          { status: 402 },
        )
      }

      if (errorMessage.includes("not configured")) {
        return Response.json(
          {
            success: false,
            error: "OpenAI API key not configured. Please set up API key in the admin panel.",
            needsConfiguration: true,
          },
          { status: 503 },
        )
      }

      return Response.json(
        {
          success: false,
          error: `OpenAI generation failed: ${errorMessage}`,
          details: errorMessage,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Slogan generation error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate slogans",
      },
      { status: 500 },
    )
  }
}