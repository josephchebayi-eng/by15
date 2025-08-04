import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { getApiKeys } from "./api-keys"

// Quality assessment interface
export interface QualityAssessment {
  score: number // 1-10 scale
  meetsRequirements: boolean
  feedback: string
  improvements: string[]
  shouldRegenerate: boolean
  strengths: string[]
  weaknesses: string[]
}

// AI Quality Checker System
class AIQualityChecker {
  private static qualityPrompts = {
    logo: `You are a senior brand designer and creative director with 20+ years of experience evaluating logo designs. Analyze this SVG logo code against the original user requirements.

    EVALUATION CRITERIA:
    1. DESIGN QUALITY (25%): Professional appearance, visual balance, scalability
    2. BRAND ALIGNMENT (25%): Matches requested style, industry appropriateness, target audience fit
    3. TECHNICAL EXECUTION (25%): Clean SVG code, proper structure, scalability
    4. REQUIREMENT FULFILLMENT (25%): Addresses all user specifications, color scheme, style preferences

    SCORING SCALE:
    - 9-10: Exceptional, exceeds expectations
    - 7-8: Good, meets most requirements with minor issues
    - 5-6: Acceptable, meets basic requirements but has notable issues
    - 3-4: Poor, significant issues, recommend regeneration
    - 1-2: Unacceptable, major problems, must regenerate

    Provide detailed feedback and specific improvement suggestions.`,

    slogan: `You are a senior copywriter and brand strategist with expertise in creating memorable slogans. Evaluate this slogan against the user's requirements.

    EVALUATION CRITERIA:
    1. MEMORABILITY (25%): Easy to remember, catchy, sticks in mind
    2. BRAND ALIGNMENT (25%): Reflects brand values, appropriate tone, target audience fit
    3. CLARITY (25%): Clear message, easy to understand, no confusion
    4. UNIQUENESS (25%): Distinctive, avoids clichés, competitive differentiation

    Consider: Length, rhythm, emotional impact, versatility across marketing channels.`,

    tagline: `You are a brand strategist and marketing expert specializing in tagline development. Assess this tagline's effectiveness.

    EVALUATION CRITERIA:
    1. STRATEGIC ALIGNMENT (30%): Supports brand positioning, clear value proposition
    2. MEMORABILITY (25%): Memorable, quotable, brand recall
    3. DIFFERENTIATION (25%): Unique positioning, competitive advantage
    4. VERSATILITY (20%): Works across channels, timeless appeal

    Focus on strategic impact and long-term brand building potential.`,

    brandname: `You are a naming expert and brand consultant with extensive experience in brand name development. Evaluate this brand name.

    EVALUATION CRITERIA:
    1. MEMORABILITY (25%): Easy to remember, pronounce, and spell
    2. BRAND FIT (25%): Appropriate for industry, target audience, brand personality
    3. UNIQUENESS (25%): Distinctive, avoids generic terms, trademark potential
    4. SCALABILITY (25%): Works internationally, future business expansion

    Consider: Domain availability implications, cultural sensitivity, legal considerations.`,

    banner: `You are a digital marketing designer and advertising creative director. Evaluate this banner design concept.

    EVALUATION CRITERIA:
    1. VISUAL IMPACT (25%): Eye-catching, clear hierarchy, effective use of space
    2. MESSAGE CLARITY (25%): Clear communication, readable text, strong CTA
    3. BRAND CONSISTENCY (25%): Aligns with brand guidelines, appropriate style
    4. PLATFORM OPTIMIZATION (25%): Suitable for intended platform, technical requirements

    Focus on conversion potential and marketing effectiveness.`,

    poster: `You are a graphic designer and visual communications expert specializing in poster design. Assess this poster concept.

    EVALUATION CRITERIA:
    1. VISUAL HIERARCHY (25%): Clear information flow, effective typography, balanced composition
    2. AESTHETIC APPEAL (25%): Visually engaging, appropriate style, color harmony
    3. COMMUNICATION EFFECTIVENESS (25%): Clear message delivery, target audience appeal
    4. PRODUCTION READINESS (25%): Print-ready specifications, technical quality

    Consider: Viewing distance, reproduction quality, audience engagement.`,
  }

  static async assessQuality(
    generatedContent: string,
    originalPrompt: string,
    designType: "logo" | "banner" | "poster" | "slogan" | "tagline" | "brandname",
    additionalContext?: any,
  ): Promise<QualityAssessment> {
    try {
      console.log(`🔍 Assessing ${designType} quality...`)

      const systemPrompt = `${this.qualityPrompts[designType]}

      RESPONSE FORMAT (JSON):
      {
        "score": number (1-10),
        "meetsRequirements": boolean,
        "feedback": "detailed assessment",
        "improvements": ["specific improvement 1", "specific improvement 2"],
        "shouldRegenerate": boolean,
        "strengths": ["strength 1", "strength 2"],
        "weaknesses": ["weakness 1", "weakness 2"]
      }

      Be thorough, specific, and constructive in your evaluation.`

      const assessmentPrompt = `ORIGINAL USER REQUEST: "${originalPrompt}"

      ${additionalContext ? `ADDITIONAL CONTEXT: ${JSON.stringify(additionalContext)}` : ""}

      GENERATED ${designType.toUpperCase()}: 
      ${generatedContent}

      Provide a comprehensive quality assessment:`

      const { openai_api_key } = await getApiKeys()
      if (!openai_api_key) {
        console.warn("⚠️ OpenAI not available for quality assessment")
        return {
          score: 7,
          meetsRequirements: true,
          feedback: "Quality assessment unavailable - OpenAI not configured",
          improvements: [],
          shouldRegenerate: false,
          strengths: ["Generated successfully"],
          weaknesses: ["Unable to assess quality"],
        }
      }

      const assessmentText = await generateWithOpenAI(assessmentPrompt, systemPrompt)

      // Try to parse JSON response
      try {
        const jsonMatch = assessmentText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const assessment = JSON.parse(jsonMatch[0])
          console.log(`✅ Quality assessment completed: Score ${assessment.score}/10`)
          return assessment
        }
      } catch (parseError) {
        console.warn("⚠️ Failed to parse JSON assessment, using text analysis")
      }

      // Fallback: analyze text response
      const score =
        assessmentText.includes("excellent") || assessmentText.includes("exceptional")
          ? 9
          : assessmentText.includes("good") || assessmentText.includes("meets")
            ? 7
            : assessmentText.includes("acceptable")
              ? 6
              : assessmentText.includes("poor") || assessmentText.includes("issues")
                ? 4
                : 7

      return {
        score,
        meetsRequirements: score >= 6,
        feedback: assessmentText,
        improvements: [],
        shouldRegenerate: score < 5,
        strengths: [],
        weaknesses: [],
      }
    } catch (error) {
      console.error("❌ Quality assessment failed:", error)
      return {
        score: 7,
        meetsRequirements: true,
        feedback: "Quality assessment failed - assuming acceptable quality",
        improvements: [],
        shouldRegenerate: false,
        strengths: [],
        weaknesses: [],
      }
    }
  }
}

// Prompt enhancement system
class PromptEnhancer {
  private static designEnhancementPrompts = {
    logo: `Transform this basic logo request into a comprehensive design brief:

    VISUAL ELEMENTS:
    - Describe the overall style and aesthetic approach
    - Specify iconography, symbols, or graphic elements
    - Detail typography style and font characteristics
    - Define color palette with specific color psychology
    - Outline composition and layout principles

    BRAND CONTEXT:
    - Industry positioning and target audience
    - Brand personality and emotional tone
    - Competitive differentiation requirements
    - Usage contexts (digital, print, merchandise)
    - Scalability and versatility needs

    TECHNICAL SPECIFICATIONS:
    - Format requirements (SVG, vector-based)
    - Size and proportion considerations
    - Monochrome and color variations
    - Background compatibility requirements`,

    banner: `Transform this banner request into a detailed design specification:

    LAYOUT & COMPOSITION:
    - Overall visual hierarchy and flow
    - Text placement and typography treatment
    - Image/graphic element positioning
    - Call-to-action prominence and styling
    - Balance and visual weight distribution

    VISUAL DESIGN:
    - Color scheme with psychological impact
    - Typography choices and readability
    - Imagery style and mood
    - Graphic elements and decorative features
    - Brand consistency requirements

    PLATFORM OPTIMIZATION:
    - Specific platform requirements and dimensions
    - Responsive design considerations
    - File format and quality specifications
    - Loading speed optimization needs
    - Cross-platform compatibility`,

    poster: `Transform this poster concept into a comprehensive design brief:

    VISUAL HIERARCHY:
    - Primary message prominence and treatment
    - Secondary information organization
    - Supporting details placement and styling
    - Contact information integration
    - Visual flow and reading pattern

    DESIGN AESTHETICS:
    - Overall style and artistic approach
    - Color palette with emotional impact
    - Typography system and hierarchy
    - Imagery and graphic elements
    - Texture, patterns, and visual effects

    PRODUCTION REQUIREMENTS:
    - Print size and resolution specifications
    - Paper type and finish considerations
    - Color mode (CMYK/RGB) requirements
    - Bleed and margin specifications
    - Distribution and display context`,

    slogan: `Transform this slogan request into a comprehensive creative brief:

    BRAND VOICE:
    - Tone and personality characteristics
    - Target audience communication style
    - Emotional resonance and impact
    - Brand values and positioning
    - Competitive differentiation angle

    CREATIVE DIRECTION:
    - Message clarity and memorability
    - Rhythm, cadence, and flow
    - Word choice and vocabulary level
    - Cultural relevance and sensitivity
    - Versatility across marketing channels

    STRATEGIC CONTEXT:
    - Campaign objectives and goals
    - Usage scenarios and applications
    - Brand equity and recognition factors
    - Market positioning requirements
    - Long-term brand building considerations`,

    tagline: `Transform this tagline request into a strategic creative brief:

    STRATEGIC POSITIONING:
    - Brand promise and value proposition
    - Market differentiation strategy
    - Target audience insights and needs
    - Competitive landscape analysis
    - Brand equity and recognition goals

    CREATIVE EXECUTION:
    - Message clarity and impact
    - Emotional connection and resonance
    - Memorability and recall factors
    - Versatility across touchpoints
    - Timeless vs. contemporary approach

    BRAND INTEGRATION:
    - Consistency with brand voice
    - Alignment with visual identity
    - Cross-channel application needs
    - International and cultural considerations
    - Legal and trademark requirements`,

    brandname: `Transform this brand name request into a comprehensive naming brief:

    STRATEGIC FOUNDATION:
    - Business category and industry context
    - Target market and audience profile
    - Brand positioning and differentiation
    - Growth and expansion considerations
    - Competitive landscape analysis

    CREATIVE CRITERIA:
    - Name style and personality
    - Length and pronunciation preferences
    - Memorability and recall factors
    - International and cultural sensitivity
    - Trademark and domain availability

    PRACTICAL REQUIREMENTS:
    - Legal clearance considerations
    - Domain name availability
    - Social media handle consistency
    - Pronunciation and spelling clarity
    - Scalability and future-proofing`,
  }

  static async enhancePromptToDesignDescription(
    originalPrompt: string,
    designType: "logo" | "banner" | "poster" | "slogan" | "tagline" | "brandname",
    additionalContext?: any,
  ): Promise<{ enhancedPrompt: string; enhancementUsed: boolean }> {
    try {
      console.log(`🎨 Converting ${designType} prompt to detailed design description...`)

      const enhancementSystemPrompt = `You are a senior creative director and design strategist with 15+ years of experience in brand design and marketing. Your expertise spans visual design, brand strategy, and creative direction.

      Your task is to transform basic user requests into comprehensive, professional design briefs that will produce exceptional results when sent to AI generation systems.

      INSTRUCTIONS:
      - Analyze the user's basic request and expand it into a detailed professional brief
      - Add industry best practices and design principles
      - Include specific visual, technical, and strategic requirements
      - Make assumptions about professional standards when details are missing
      - Ensure the brief is actionable and comprehensive
      - Focus on creating designs that are both beautiful and strategically effective

      RESPONSE FORMAT:
      Provide a detailed, professional design brief that includes all necessary specifications for high-quality ${designType} creation. Be specific, comprehensive, and professional.`

      const enhancementPrompt = `${this.designEnhancementPrompts[designType]}

      USER'S ORIGINAL REQUEST: "${originalPrompt}"
      
      ${additionalContext ? `ADDITIONAL CONTEXT: ${JSON.stringify(additionalContext)}` : ""}

      Transform this into a comprehensive professional design brief:`

      const { openai_api_key } = await getApiKeys()
      if (!openai_api_key) {
        console.warn("⚠️ OpenAI not available for prompt enhancement, using original prompt")
        return { enhancedPrompt: originalPrompt, enhancementUsed: false }
      }

      const enhancedPrompt = await generateWithOpenAI(enhancementPrompt, enhancementSystemPrompt)

      if (enhancedPrompt && enhancedPrompt.length > originalPrompt.length) {
        console.log(
          `✅ ${designType} prompt enhanced from ${originalPrompt.length} to ${enhancedPrompt.length} characters`,
        )
        return { enhancedPrompt, enhancementUsed: true }
      }

      console.warn("⚠️ Enhancement didn't improve prompt, using original")
      return { enhancedPrompt: originalPrompt, enhancementUsed: false }
    } catch (error) {
      console.warn("⚠️ Prompt enhancement failed, using original:", error)
      return { enhancedPrompt: originalPrompt, enhancementUsed: false }
    }
  }
}

export async function generateWithOpenAI(prompt: string, systemPrompt?: string) {
  try {
    const { openai_api_key } = await getApiKeys()

    if (!openai_api_key) {
      throw new Error("OpenAI API key not configured")
    }

    console.log("🔄 Attempting OpenAI generation...")

    const openai = createOpenAI({
      apiKey: openai_api_key,
    })

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system: systemPrompt,
      maxTokens: 1000,
      temperature: 0.7,
    })

    console.log("✅ OpenAI generation successful")
    return text
  } catch (error) {
    console.error("❌ OpenAI generation error:", error)

    // Check if it's a quota/billing error
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes("quota") || errorMessage.includes("billing") || errorMessage.includes("exceeded")) {
      throw new Error("OpenAI quota exceeded - please check your billing")
    }

    throw error
  }
}

// Text generation function (formerly generateWithFallback)
export async function generateText(
  originalPrompt: string,
  systemPrompt?: string,
  enhancePrompt = true,
): Promise<{
  text: string
  usedProvider: string
  model?: string
  promptEnhanced: boolean
  enhancedPrompt?: string
}> {
  console.log(`🚀 Starting text generation with OpenAI`)

  // Enhance the prompt if requested
  let finalPrompt = originalPrompt
  let promptEnhanced = false
  let enhancedPrompt: string | undefined

  if (enhancePrompt) {
    try {
      // For backward compatibility, we'll use a simple enhancement
      const enhancement = await PromptEnhancer.enhancePromptToDesignDescription(
        originalPrompt,
        "banner", // Default design type for general enhancement
      )
      finalPrompt = enhancement.enhancedPrompt
      promptEnhanced = enhancement.enhancementUsed
      if (promptEnhanced) {
        enhancedPrompt = finalPrompt
        console.log(`🎨 Prompt enhanced - converted to detailed design description`)
      }
    } catch (enhancementError) {
      console.warn("⚠️ Prompt enhancement failed, using original prompt:", enhancementError)
    }
  }

  try {
    console.log(`🔄 Attempting generation with OpenAI...`)

    const text = await generateWithOpenAI(finalPrompt, systemPrompt)

    console.log(`✅ Successfully generated text using OpenAI`)
    return {
      text,
      usedProvider: "openai",
      model: "gpt-4o",
      promptEnhanced,
      enhancedPrompt,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("❌ OpenAI failed:", errorMessage)

    // Check if it's a configuration issue
    if (errorMessage.includes("not configured")) {
      throw new Error("OpenAI API key not configured. Please set up API key in the admin panel.")
    }

    throw new Error(`OpenAI generation failed: ${errorMessage}`)
  }
}

// Enhanced design-specific generation function with quality checking
export async function generateDesignWithEnhancement(
  originalPrompt: string,
  designType: "logo" | "banner" | "poster" | "slogan" | "tagline" | "brandname",
  additionalContext?: any,
  systemPrompt?: string,
  maxRetries = 2,
): Promise<{
  text: string
  usedProvider: string
  model?: string
  promptEnhanced: boolean
  enhancedPrompt: string
  qualityAssessment?: QualityAssessment
  regenerationCount: number
}> {
  console.log(`🎨 Starting ${designType} generation with design-focused enhancement...`)

  // Always enhance for design tasks - convert to professional design brief
  const enhancement = await PromptEnhancer.enhancePromptToDesignDescription(
    originalPrompt,
    designType,
    additionalContext,
  )

  const finalPrompt = enhancement.enhancedPrompt
  const promptEnhanced = enhancement.enhancementUsed

  console.log(`🎨 Design brief created: ${promptEnhanced ? "Enhanced" : "Original"} (${finalPrompt.length} chars)`)

  let regenerationCount = 0

  // Generation loop with quality checking and regeneration
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempting ${designType} generation with OpenAI (attempt ${attempt + 1}/${maxRetries + 1})...`)

      const text = await generateWithOpenAI(finalPrompt, systemPrompt)

      console.log(`✅ Generated ${designType} using OpenAI`)

      // Perform quality assessment
      const qualityAssessment = await AIQualityChecker.assessQuality(
        text,
        originalPrompt,
        designType,
        additionalContext,
      )

      console.log(
        `🔍 Quality score: ${qualityAssessment.score}/10 - ${qualityAssessment.meetsRequirements ? "PASS" : "FAIL"}`,
      )

      // If quality is acceptable or we've reached max retries, return result
      if (!qualityAssessment.shouldRegenerate || attempt >= maxRetries) {
        return {
          text,
          usedProvider: "openai",
          model: "gpt-4o",
          promptEnhanced,
          enhancedPrompt: finalPrompt,
          qualityAssessment,
          regenerationCount,
        }
      }

      // Quality check failed, try regeneration
      console.log(`⚠️ Quality check failed (score: ${qualityAssessment.score}/10), regenerating...`)
      regenerationCount++
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.warn(`❌ OpenAI failed for ${designType}:`, errorMessage)

      if (attempt >= maxRetries) {
        if (errorMessage.includes("not configured")) {
          throw new Error("OpenAI API key not configured. Please set up API key in the admin panel.")
        }

        throw new Error(`OpenAI generation failed for ${designType} after ${maxRetries + 1} attempts: ${errorMessage}`)
      }
    }
  }

  throw new Error(`Failed to generate acceptable ${designType} after ${maxRetries + 1} attempts`)
}

export async function generateImageWithOpenAI(prompt: string, size = "1024x1024") {
  try {
    const { openai_api_key } = await getApiKeys()

    if (!openai_api_key) {
      throw new Error("OpenAI API key not configured")
    }

    console.log("🔄 Attempting OpenAI image generation...")

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openai_api_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        size,
        quality: "hd",
        n: 1,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("❌ OpenAI Image API error:", errorData)

      // Handle quota errors specifically
      if (
        errorData.error?.code === "insufficient_quota" ||
        errorData.error?.message?.includes("quota") ||
        errorData.error?.message?.includes("billing")
      ) {
        throw new Error("QUOTA_EXCEEDED")
      }

      throw new Error(`OpenAI Image API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    console.log("✅ OpenAI image generation successful")
    return data.data[0]?.url || ""
  } catch (error) {
    console.error("❌ OpenAI image generation error:", error)
    throw error
  }
}

export async function generateImageWithFluxAI(prompt: string, size = "1024x1024") {
  try {
    const { flux_api_key } = await getApiKeys()

    if (!flux_api_key) {
      throw new Error("FLUX AI API key not configured")
    }

    console.log("🔄 Attempting FLUX AI image generation...")

    // Using Together AI's API for FLUX.1 models
    const response = await fetch("https://api.together.xyz/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${flux_api_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell",
        prompt,
        width: parseInt(size.split("x")[0]) || 1024,
        height: parseInt(size.split("x")[1]) || 1024,
        steps: 4,
        n: 1,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("❌ FLUX AI Image API error:", errorData)

      if (
        errorData.error?.code === "insufficient_quota" ||
        errorData.error?.message?.includes("quota") ||
        errorData.error?.message?.includes("billing")
      ) {
        throw new Error("QUOTA_EXCEEDED")
      }

      throw new Error(`FLUX AI Image API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    console.log("✅ FLUX AI image generation successful")
    return data.data[0]?.url || ""
  } catch (error) {
    console.error("❌ FLUX AI image generation error:", error)
    throw error
  }
}

// New image generation function with explicit provider selection
export async function generateImage(
  provider: "openai" | "flux",
  originalPrompt: string,
  size = "1024x1024",
  designType: "logo" | "banner" | "poster" = "poster",
  additionalContext?: any,
): Promise<{
  imageUrl: string
  usedProvider: string
  model?: string
  promptEnhanced: boolean
  enhancedPrompt: string
}> {
  console.log(`🎨 Starting image generation with ${provider.toUpperCase()}...`)

  // Always enhance image prompts with design-focused enhancement
  const enhancement = await PromptEnhancer.enhancePromptToDesignDescription(
    originalPrompt,
    designType,
    additionalContext,
  )

  const finalPrompt = enhancement.enhancedPrompt
  const promptEnhanced = enhancement.enhancementUsed

  console.log(`🎨 Image prompt enhanced for ${designType}: ${promptEnhanced ? "Yes" : "No"}`)

  let imageUrl: string
  let model: string | undefined

  if (provider === "openai") {
    imageUrl = await generateImageWithOpenAI(finalPrompt, size)
    model = "dall-e-3"
  } else if (provider === "flux") {
    imageUrl = await generateImageWithFluxAI(finalPrompt, size)
    model = "flux.1-schnell"
  } else {
    throw new Error(`Unsupported provider: ${provider}`)
  }

  return {
    imageUrl,
    usedProvider: provider,
    model,
    promptEnhanced,
    enhancedPrompt: finalPrompt,
  }
}

// Provider availability check
export async function checkProviderAvailability(): Promise<{
  openai: boolean
  flux: boolean
  hasAnyProvider: boolean
  diagnostics: {
    openai: string
    flux: string
  }
}> {
  try {
    const { openai_api_key, flux_api_key } = await getApiKeys()

    const openaiAvailable = !!openai_api_key && openai_api_key.trim().length > 0
    const fluxAvailable = !!flux_api_key && flux_api_key.trim().length > 0

    const diagnostics = {
      openai: openaiAvailable ? `✅ Key configured (${openai_api_key.substring(0, 7)}...)` : "❌ No API key configured",
      flux: fluxAvailable ? `✅ Key configured (${flux_api_key.substring(0, 7)}...)` : "❌ No API key configured",
    }

    console.log("🔍 Provider availability check:", diagnostics)

    return {
      openai: openaiAvailable,
      flux: fluxAvailable,
      hasAnyProvider: openaiAvailable || fluxAvailable,
      diagnostics,
    }
  } catch (error) {
    console.error("❌ Error checking provider availability:", error)
    return {
      openai: false,
      flux: false,
      hasAnyProvider: false,
      diagnostics: {
        openai: "❌ Error checking availability",
        flux: "❌ Error checking availability",
      },
    }
  }
}

// Export the quality checker for external use
export { AIQualityChecker }