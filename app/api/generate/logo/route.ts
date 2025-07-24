import { generateDesignWithEnhancement, checkProviderAvailability } from "@/lib/ai-providers"

export async function POST(req: Request) {
  try {
    const { prompt, style, colors, industry, provider = "openai", formats = ["png"] } = await req.json()

    if (!prompt || !prompt.trim()) {
      return Response.json({ success: false, error: "Prompt is required" }, { status: 400 })
    }

    // Check provider availability
    const availability = await checkProviderAvailability()
    if (!availability.hasAnyProvider) {
      return Response.json({
        success: false,
        error: "No AI providers configured. Please set up API keys in the admin panel.",
        needsConfiguration: true,
      }, { status: 503 })
    }

    // Design context
    const additionalContext = {
      style,
      colors,
      industry,
      type: "logo",
      format: "PNG",
      requirements: "vibrant, full-color, high-res branding image",
      requestedFormats: formats,
    }

    try {
      console.log("🎨 Generating vibrant image-based logo using DALL·E...")

      const systemPrompt = `You are a professional brand designer. Create a bold, colorful, modern logo image for a company. The logo should:

- Be visually striking and suitable for a website, social media, and print
- Include vibrant colors, bold typography, or strong symbolic imagery
- Reflect the industry: ${industry || "general"}
- Incorporate style: ${style || "modern and clean"}
- Follow branding best practices and visual balance
- Be delivered as a clean, centered logo on a transparent or white background

Output only a finished full-color image, no text or explanation.`

      const result = await generateDesignWithEnhancement(
        prompt,
        "logo",
        additionalContext,
        systemPrompt,
        "openai", // Using DALL·E 3
        1,
      )

      const imageUrl = result.imageUrl || result.imageBase64
      if (!imageUrl) {
        throw new Error("No image returned from DALL·E")
      }

      const response: any = {
        success: true,
        image: imageUrl,
        prompt: result.enhancedPrompt,
        provider: result.usedProvider,
        model: result.model,
        fallbackUsed: result.fallbackUsed,
        promptEnhanced: result.promptEnhanced,
        regenerationCount: result.regenerationCount,
        message: `Generated vibrant logo using ${result.usedProvider}${result.model ? ` (${result.model})` : ""}`,
      }

      if (result.qualityAssessment) {
        response.qualityAssessment = result.qualityAssessment
      }

      return Response.json(response)
    } catch (aiError) {
      console.error("❌ Logo generation failed:", aiError)
      const errorMessage = aiError instanceof Error ? aiError.message : "Unknown error"

      if (errorMessage.includes("quota") || errorMessage.includes("billing")) {
        return Response.json({
          success: false,
          error: "AI quota exceeded. Please check your billing settings or try again later.",
          quotaExceeded: true,
        }, { status: 402 })
      }

      if (errorMessage.includes("not configured")) {
        return Response.json({
          success: false,
          error: "AI providers not configured. Please set up API keys in the admin panel.",
          needsConfiguration: true,
        }, { status: 503 })
      }

      return Response.json({
        success: false,
        error: "AI generation service temporarily unavailable. Please try again later.",
        details: errorMessage,
      }, { status: 503 })
    }
  } catch (error) {
    console.error("❌ Logo generation error:", error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate logo",
    }, { status: 500 })
  }
}
