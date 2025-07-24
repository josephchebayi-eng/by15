import { generateDesignWithEnhancement, checkProviderAvailability, convertSvgToFormats } from "@/lib/ai-providers"

export async function POST(req: Request) {
  try {
    const { prompt, style, colors, industry, provider = "openai", formats = ["svg"] } = await req.json()

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
    if (!availability.hasAnyProvider) {
      return Response.json(
        {
          success: false,
          error: "No AI providers configured. Please set up API keys in the admin panel.",
          needsConfiguration: true,
        },
        { status: 503 },
      )
    }

    // Prepare additional context for enhanced prompt generation
    const additionalContext = {
      style,
      colors,
      industry,
      type: "logo",
      format: "SVG",
      requirements: "scalable vector graphics, professional quality",
      requestedFormats: formats,
    }

    try {
      console.log("🎨 Generating logo with enhanced design prompt and quality checking...")

      // Use design-focused enhancement for logo generation with quality checking
      const systemPrompt = `You are a world-class logo designer and brand identity expert with 20+ years of experience. Create professional SVG logo code that is:

      - Scalable and vector-based with clean, optimized code
      - Professionally designed with perfect proportions and visual balance
      - Optimized for various applications (web, print, merchandise, social media)
      - Following design best practices and brand guidelines
      - Clean, memorable, and distinctive with strong brand recognition
      - Technically excellent SVG structure with proper viewBox and dimensions
      - Compatible with all modern browsers and design software

      IMPORTANT: Return ONLY clean, valid SVG code without any explanations, markdown formatting, or additional text. The SVG should be complete and ready to use.`

      const result = await generateDesignWithEnhancement(
        prompt,
        "logo",
        additionalContext,
        systemPrompt,
        provider === "openrouter" && availability.openrouter ? "openrouter" : "openai",
        2, // Allow up to 2 regenerations for quality
      )

      // Clean up the SVG response
      let svgContent = result.text.trim()

      // Remove markdown code blocks if present
      svgContent = svgContent
        .replace(/```svg\n?/g, "")
        .replace(/```xml\n?/g, "")
        .replace(/```\n?/g, "")

      // Extract SVG content if wrapped in other text
      const svgMatch = svgContent.match(/<svg[\s\S]*?<\/svg>/i)
      if (svgMatch) {
        svgContent = svgMatch[0]
      } else if (!svgContent.startsWith("<svg")) {
        throw new Error("No valid SVG content found in response")
      }

      // Basic SVG validation
      if (!svgContent.includes("<svg") || !svgContent.includes("</svg>")) {
        throw new Error("Invalid SVG structure generated")
      }

      // Convert to multiple formats if requested
      const logoFormats = await convertSvgToFormats(svgContent)

      // Prepare response with quality assessment
      const response: any = {
        success: true,
        svg: svgContent,
        formats: {
          svg: svgContent,
          ...(formats.includes("png") && { png: logoFormats.png }),
          ...(formats.includes("jpeg") && { jpeg: logoFormats.jpeg }),
        },
        prompt: result.enhancedPrompt,
        provider: result.usedProvider,
        model: result.model,
        fallbackUsed: result.fallbackUsed,
        promptEnhanced: result.promptEnhanced,
        regenerationCount: result.regenerationCount,
        message: `Generated professional logo using ${result.usedProvider}${result.model ? ` (${result.model})` : ""} with enhanced design brief${result.regenerationCount > 0 ? ` (${result.regenerationCount} regenerations for quality)` : ""}`,
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
      console.error("❌ Logo generation failed:", aiError)

      const errorMessage = aiError instanceof Error ? aiError.message : "Unknown error"

      if (errorMessage.includes("quota") || errorMessage.includes("billing")) {
        return Response.json(
          {
            success: false,
            error: "AI quota exceeded. Please check your billing settings or try again later.",
            quotaExceeded: true,
            details: "Please add credits to your AI provider account or upgrade your plan.",
          },
          { status: 402 },
        )
      }

      if (errorMessage.includes("not configured")) {
        return Response.json(
          {
            success: false,
            error: "AI providers not configured. Please set up API keys in the admin panel.",
            needsConfiguration: true,
          },
          { status: 503 },
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
  } catch (error) {
    console.error("❌ Logo generation error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate logo",
      },
      { status: 500 },
    )
  }
}
