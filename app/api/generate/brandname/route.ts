import { generateWithFallback, checkProviderAvailability } from "@/lib/ai-providers"

export async function POST(req: Request) {
  try {
    const { industry, style, keywords, description, enhancePrompt = true } = await req.json()

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

    const systemPrompt = `You are a professional brand naming expert with deep expertise in linguistics, trademark law, domain availability, and global brand strategy. Create unique, memorable brand names with comprehensive market viability.
    
    Expert Guidelines:
    - Create names that are phonetically appealing and easy to pronounce globally
    - Ensure names are suitable and resonant within the target industry
    - Simulate realistic domain availability (favor available .com domains)
    - Apply trademark screening principles (avoid obvious conflicts)
    - Design names that are scalable and professionally viable
    - Consider cultural appropriateness and global market expansion
    - Apply linguistic principles for memorability and brand recall
    - Ensure names support long-term brand architecture
    - Consider pronunciation across different languages and accents
    - Optimize for digital presence and SEO considerations
    
    Quality Standards:
    - Each name must pass basic trademark screening principles
    - Prioritize names with likely .com domain availability
    - Ensure names work across different marketing channels
    - Test for negative connotations in major languages
    - Validate scalability for business growth and expansion
    
    For each name, provide realistic domain and trademark status based on naming best practices.
    
    Return exactly 8 brand name suggestions in this format:
    BrandName|domain.com|available|trademark_status
    
    Use 'available' or 'taken' for domain status, and 'clear' or 'check_needed' for trademark status.`

    const basePrompt = `Generate professional brand names with these specifications:
    
    Target Industry: ${industry}
    Naming Style: ${style}
    Relevant Keywords: ${keywords}
    Business Description: ${description}
    
    Create 8 unique, market-viable brand names with domain and trademark information:`

    let namesText: string
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
      namesText = result.text
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
          error: "AI generation service temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      )
    }

    // Parse brand names from the response
    const brandNames = namesText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.includes("|") && !line.includes("Here are"))
      .slice(0, 8)
      .map((line) => {
        const [name, domain, available, trademark] = line.split("|")
        return {
          name: name?.trim() || "",
          domain: domain?.trim() || "",
          available: available?.trim() === "available",
          trademark: trademark?.trim() === "clear",
        }
      })
      .filter((item) => item.name && item.domain)

    return Response.json({
      success: true,
      brandNames,
      prompt: basePrompt,
      enhancedPrompt: promptEnhanced ? enhancedPrompt : undefined,
      provider: usedProvider,
      model,
      fallbackUsed,
      promptEnhanced,
      message: `Generated using ${usedProvider}${model ? ` (${model})` : ""}${promptEnhanced ? " with enhanced prompt" : ""}`,
    })
  } catch (error) {
    console.error("Brand name generation error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate brand names",
      },
      { status: 500 },
    )
  }
}
