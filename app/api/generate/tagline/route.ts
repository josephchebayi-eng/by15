import { generateWithFallback, checkProviderAvailability } from "@/lib/ai-providers"

export async function POST(req: Request) {
  try {
    const {
      brandName,
      positioning,
      targetAudience,
      keyMessage,
      enhancePrompt = true,
    } = await req.json()

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

    const systemPrompt = `You are a professional brand strategist and positioning expert specializing in tagline creation. Create compelling taglines that communicate brand positioning and value propositions with strategic precision.
    
    Strategic Guidelines:
    - Craft taglines that are strategic yet accessible (3-8 words optimal)
    - Focus on clear brand positioning and competitive differentiation
    - Communicate unique value propositions and brand promises
    - Ensure professional tone while maintaining memorability
    - Reflect the brand's strategic positioning in the market
    - Consider target audience demographics and psychographics
    - Use strategic language that builds long-term brand equity
    - Apply positioning theory and brand architecture principles
    - Ensure consistency with overall brand strategy
    - Optimize for various business applications and contexts
    
    Quality Standards:
    - Each tagline must support strategic brand objectives
    - Test for clarity of value proposition communication
    - Ensure differentiation from competitive messaging
    - Consider scalability across different market segments
    - Validate alignment with brand positioning framework
    
    Return exactly 8 different tagline options, each on a new line, without numbering, bullet points, or explanations.`

    const basePrompt = `Create professional taglines for this brand:
    
    Brand Name: ${brandName}
    Market Positioning: ${positioning}
    Target Audience: ${targetAudience}
    Key Brand Message: ${keyMessage}
    
    Generate 8 unique taglines that communicate strategic brand positioning and drive market differentiation:`

    let taglinesText: string
    let usedProvider: string
    let fallbackUsed: boolean
    let model: string | undefined
    let promptEnhanced: boolean
    let enhancedPrompt: string | undefined

    try {
      const result = await generateWithFallback(
        basePrompt,
        systemPrompt,
        enhancePrompt,
      )
      taglinesText = result.text
      usedProvider = result.usedProvider
      fallbackUsed = result.fallbackUsed
      model = result.model
      promptEnhanced = result.promptEnhanced
      enhancedPrompt = result.enhancedPrompt
    } catch (aiError) {
      console.error("OpenAI generation failed:", aiError)

      return Response.json(
        {
          success: false,
          error: "OpenAI generation service temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      )
    }

    // Parse taglines from the response
    const taglines = taglinesText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.match(/^\d+\./) && line !== "" && !line.includes("Here are"))
      .slice(0, 8)

    return Response.json({
      success: true,
      taglines,
      prompt: basePrompt,
      enhancedPrompt: promptEnhanced ? enhancedPrompt : undefined,
      provider: usedProvider,
      model,
      fallbackUsed,
      promptEnhanced,
      message: `Generated using ${usedProvider}${model ? ` (${model})` : ""}${promptEnhanced ? " with enhanced prompt" : ""}`,
    })
  } catch (error) {
    console.error("Tagline generation error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate taglines",
      },
      { status: 500 },
    )
  }
}
