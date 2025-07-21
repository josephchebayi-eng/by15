import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { getApiKeys } from "./api-keys"

// Enhanced task-specific model configurations with more high-performing models
const TASK_MODELS = {
  // Creative text generation (slogans, taglines, brand names)
  creative: [
    "anthropic/claude-3.5-sonnet", // Best for creative writing
    "openai/gpt-4o", // Excellent creativity
    "deepseek/deepseek-chat", // Excellent creative capabilities
    "qwen/qwen-2.5-72b-instruct", // Strong creative reasoning
    "meta-llama/llama-3.1-70b-instruct", // Good creative capabilities
    "mistralai/mistral-large", // Strong creative performance
    "google/gemini-pro-1.5", // Good creative output
    "anthropic/claude-3-haiku", // Fast creative responses
    "openai/gpt-3.5-turbo", // Reliable fallback
    "meta-llama/llama-3.1-8b-instruct:free", // Free creative option
    "google/gemma-2-9b-it:free", // Free creative fallback
  ],

  // Technical/structured content (SVG code, detailed descriptions)
  technical: [
    "openai/gpt-4o", // Best for code generation
    "anthropic/claude-3.5-sonnet", // Excellent at structured output
    "deepseek/deepseek-coder", // Specialized coding model
    "qwen/qwen-2.5-coder-32b-instruct", // Strong coding capabilities
    "meta-llama/llama-3.1-70b-instruct", // Good technical capabilities
    "mistralai/codestral", // Code-specialized model
    "google/gemini-pro-1.5", // Good technical output
    "anthropic/claude-3-haiku", // Fast technical responses
    "openai/gpt-3.5-turbo", // Reliable fallback
    "meta-llama/llama-3.1-8b-instruct:free", // Free technical option
    "deepseek/deepseek-coder:free", // Free coding model
  ],

  // Visual descriptions (for image generation prompts)
  visual: [
    "anthropic/claude-3.5-sonnet", // Excellent visual understanding
    "openai/gpt-4o", // Great visual descriptions
    "google/gemini-pro-vision", // Specialized visual model
    "qwen/qwen-2.5-72b-instruct", // Strong visual reasoning
    "meta-llama/llama-3.1-70b-instruct", // Good visual capabilities
    "mistralai/mistral-large", // Good visual descriptions
    "anthropic/claude-3-haiku", // Fast visual responses
    "openai/gpt-3.5-turbo", // Fallback
    "meta-llama/llama-3.1-8b-instruct:free", // Free visual option
    "google/gemma-2-9b-it:free", // Free visual fallback
  ],

  // Brand strategy (positioning, analysis)
  strategy: [
    "anthropic/claude-3.5-sonnet", // Best for strategic thinking
    "openai/gpt-4o", // Excellent reasoning
    "qwen/qwen-2.5-72b-instruct", // Strong analytical capabilities
    "deepseek/deepseek-chat", // Good strategic reasoning
    "meta-llama/llama-3.1-70b-instruct", // Good analytical skills
    "mistralai/mistral-large", // Strong strategic thinking
    "google/gemini-pro-1.5", // Good strategic analysis
    "anthropic/claude-3-haiku", // Fast strategic responses
    "openai/gpt-3.5-turbo", // Fallback
    "meta-llama/llama-3.1-8b-instruct:free", // Free strategic option
  ],

  // General purpose
  general: [
    "openai/gpt-3.5-turbo", // Fast and reliable
    "anthropic/claude-3-haiku", // Fast responses
    "qwen/qwen-2.5-72b-instruct", // High quality free option
    "meta-llama/llama-3.1-8b-instruct:free", // Free option
    "google/gemma-2-9b-it:free", // Free alternative
    "deepseek/deepseek-chat:free", // Free high-quality option
  ],
}

// Enhanced model pricing tiers with new models
const MODEL_TIERS = {
  premium: [
    "anthropic/claude-3.5-sonnet",
    "openai/gpt-4o",
    "mistralai/mistral-large",
    "google/gemini-pro-1.5",
    "google/gemini-pro-vision",
  ],
  standard: [
    "qwen/qwen-2.5-72b-instruct",
    "meta-llama/llama-3.1-70b-instruct",
    "deepseek/deepseek-chat",
    "deepseek/deepseek-coder",
    "qwen/qwen-2.5-coder-32b-instruct",
    "mistralai/codestral",
    "anthropic/claude-3-haiku",
    "openai/gpt-3.5-turbo",
  ],
  free: [
    "meta-llama/llama-3.1-8b-instruct:free",
    "google/gemma-2-9b-it:free",
    "deepseek/deepseek-chat:free",
    "deepseek/deepseek-coder:free",
    "qwen/qwen-2.5-7b-instruct:free",
    "microsoft/wizardlm-2-8x22b:free",
    "mistralai/mistral-7b-instruct:free",
  ],
}

// Task type definitions
export type TaskType = "creative" | "technical" | "visual" | "strategy" | "general"

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

      const { openrouter_api_key } = await getApiKeys()
      if (!openrouter_api_key) {
        console.warn("⚠️ OpenRouter not available for quality assessment")
        return {
          score: 7,
          meetsRequirements: true,
          feedback: "Quality assessment unavailable - OpenRouter not configured",
          improvements: [],
          shouldRegenerate: false,
          strengths: ["Generated successfully"],
          weaknesses: ["Unable to assess quality"],
        }
      }

      const client = createOpenRouterClient(openrouter_api_key)
      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: assessmentPrompt },
      ]

      const response = await client.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet", // Use premium model for quality assessment
        messages,
        max_tokens: 1000,
        temperature: 0.2, // Low temperature for consistent evaluation
      })

      const assessmentText = response.choices[0]?.message?.content?.trim()
      if (!assessmentText) {
        throw new Error("Empty assessment response")
      }

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
      // Always enhance for design tasks - convert user input to professional design brief
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

      // Use OpenRouter for enhancement with a high-quality model
      const { openrouter_api_key } = await getApiKeys()
      if (!openrouter_api_key) {
        console.warn("⚠️ OpenRouter not available for prompt enhancement, using original prompt")
        return { enhancedPrompt: originalPrompt, enhancementUsed: false }
      }

      const client = createOpenRouterClient(openrouter_api_key)
      const messages = [
        { role: "system", content: enhancementSystemPrompt },
        { role: "user", content: enhancementPrompt },
      ]

      const response = await client.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet", // Use premium model for enhancement
        messages,
        max_tokens: 1500, // Increased for detailed descriptions
        temperature: 0.4, // Balanced creativity and consistency
      })

      const enhancedPrompt = response.choices[0]?.message?.content?.trim()

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

  // Legacy method for backward compatibility
  static async enhancePrompt(
    originalPrompt: string,
    taskType: TaskType,
    systemPrompt?: string,
  ): Promise<{ enhancedPrompt: string; enhancementUsed: boolean }> {
    // Map task types to design types for enhanced processing
    const taskToDesignMap: Record<TaskType, "logo" | "banner" | "poster" | "slogan" | "tagline" | "brandname"> = {
      visual: "poster",
      creative: "slogan",
      technical: "logo",
      strategy: "tagline",
      general: "banner",
    }

    const designType = taskToDesignMap[taskType] || "banner"
    return this.enhancePromptToDesignDescription(originalPrompt, designType)
  }
}

// Improved OpenRouter configuration
const createOpenRouterClient = (apiKey: string) => {
  return {
    chat: {
      completions: {
        create: async (params: any) => {
          console.log("🔄 OpenRouter request:", {
            model: params.model,
            messageCount: params.messages?.length,
            maxTokens: params.max_tokens,
          })

          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
              "X-Title": "BrandForge AI",
            },
            body: JSON.stringify({
              model: params.model,
              messages: params.messages,
              max_tokens: params.max_tokens || 1000,
              temperature: params.temperature || 0.7,
              stream: false,
            }),
          })

          console.log("📡 OpenRouter response status:", response.status)

          if (!response.ok) {
            const errorText = await response.text()
            console.error("❌ OpenRouter error response:", errorText)

            let errorData
            try {
              errorData = JSON.parse(errorText)
            } catch {
              errorData = { error: { message: errorText } }
            }

            // Provide specific error messages
            let errorMessage = `OpenRouter API error (${response.status})`

            if (response.status === 401) {
              errorMessage = "OpenRouter API key is invalid or expired"
            } else if (response.status === 403) {
              errorMessage = "OpenRouter access forbidden - check account permissions"
            } else if (response.status === 429) {
              errorMessage = "OpenRouter rate limit exceeded"
            } else if (response.status === 400) {
              errorMessage = `OpenRouter bad request: ${errorData.error?.message || "Invalid parameters"}`
            } else if (errorData.error?.message) {
              errorMessage = `OpenRouter: ${errorData.error.message}`
            }

            throw new Error(errorMessage)
          }

          const data = await response.json()
          console.log("✅ OpenRouter response received successfully")

          return data
        },
      },
    },
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

export async function generateWithOpenRouter(
  prompt: string,
  taskType: TaskType = "general",
  systemPrompt?: string,
  preferTier: "premium" | "standard" | "free" = "premium",
) {
  try {
    const { openrouter_api_key } = await getApiKeys()

    if (!openrouter_api_key) {
      throw new Error("OpenRouter API key not configured")
    }

    console.log(`🔄 Attempting OpenRouter generation for task: ${taskType}, tier: ${preferTier}`)

    const client = createOpenRouterClient(openrouter_api_key)

    const messages = []
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt })
    }
    messages.push({ role: "user", content: prompt })

    // Get task-specific models
    let modelsToTry = TASK_MODELS[taskType] || TASK_MODELS.general

    // Filter by preferred tier if specified
    if (preferTier !== "premium") {
      const tierModels = MODEL_TIERS[preferTier]
      const filteredModels = modelsToTry.filter((model) => tierModels.includes(model))

      // If we have models in the preferred tier, use them first
      if (filteredModels.length > 0) {
        modelsToTry = [...filteredModels, ...modelsToTry.filter((model) => !tierModels.includes(model))]
      }
    }

    console.log(`🎯 Models to try for ${taskType}:`, modelsToTry.slice(0, 3)) // Log first 3 models

    let lastError: Error | null = null

    for (const model of modelsToTry) {
      try {
        console.log(`🔄 Trying OpenRouter model: ${model}`)

        // Adjust temperature based on task type
        const temperature = taskType === "creative" ? 0.8 : taskType === "technical" ? 0.3 : 0.7

        const response = await client.chat.completions.create({
          model,
          messages,
          max_tokens: 1000,
          temperature,
        })

        const content = response.choices[0]?.message?.content
        if (!content) {
          throw new Error("OpenRouter returned empty response")
        }

        console.log(`✅ Success with model: ${model} for task: ${taskType}`)
        return { text: content, model }
      } catch (modelError) {
        const errorMsg = modelError instanceof Error ? modelError.message : String(modelError)
        console.warn(`⚠️ Model ${model} failed:`, errorMsg)
        lastError = modelError instanceof Error ? modelError : new Error(errorMsg)

        // If it's a rate limit, quota error, or model unavailable, try next model immediately
        if (
          errorMsg.includes("rate limit") ||
          errorMsg.includes("quota") ||
          errorMsg.includes("unavailable") ||
          errorMsg.includes("not found")
        ) {
          continue
        }

        // For other errors, also continue to next model
        continue
      }
    }

    throw lastError || new Error(`All OpenRouter models failed for task: ${taskType}`)
  } catch (error) {
    console.error("❌ OpenRouter generation error:", error)
    throw error
  }
}

// Enhanced fallback function with design-focused prompt enhancement
export async function generateWithFallback(
  originalPrompt: string,
  systemPrompt?: string,
  preferredProvider: "openai" | "openrouter" = "openai",
  taskType: TaskType = "general",
  enhancePrompt = true,
): Promise<{
  text: string
  usedProvider: string
  fallbackUsed: boolean
  model?: string
  promptEnhanced: boolean
  enhancedPrompt?: string
}> {
  console.log(`🚀 Starting generation for task: ${taskType} with preferred provider: ${preferredProvider}`)

  // Enhance the prompt if requested - now creates detailed design descriptions
  let finalPrompt = originalPrompt
  let promptEnhanced = false
  let enhancedPrompt: string | undefined

  if (enhancePrompt) {
    try {
      const enhancement = await PromptEnhancer.enhancePrompt(originalPrompt, taskType, systemPrompt)
      finalPrompt = enhancement.enhancedPrompt
      promptEnhanced = enhancement.enhancementUsed
      if (promptEnhanced) {
        enhancedPrompt = finalPrompt
        console.log(`🎨 Prompt enhanced for ${taskType} task - converted to detailed design description`)
      }
    } catch (enhancementError) {
      console.warn("⚠️ Prompt enhancement failed, using original prompt:", enhancementError)
    }
  }

  const providers = preferredProvider === "openai" ? ["openai", "openrouter"] : ["openrouter", "openai"]
  const errors: { provider: string; error: string }[] = []

  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i]
    const isFirstChoice = i === 0

    try {
      console.log(`🔄 Attempting generation with ${provider}...`)

      let text: string
      let model: string | undefined

      if (provider === "openai") {
        text = await generateWithOpenAI(finalPrompt, systemPrompt)
        model = "gpt-4o"
      } else {
        // Use task-specific model selection for OpenRouter with intelligent tier selection
        const preferTier = taskType === "general" ? "free" : "premium" // Use free models for general tasks
        const result = await generateWithOpenRouter(finalPrompt, taskType, systemPrompt, preferTier)
        text = result.text
        model = result.model
      }

      console.log(`✅ Successfully generated text using ${provider} ${model ? `(${model})` : ""}`)
      return {
        text,
        usedProvider: provider,
        fallbackUsed: !isFirstChoice,
        model,
        promptEnhanced,
        enhancedPrompt,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.warn(`❌ ${provider} failed:`, errorMessage)

      errors.push({ provider, error: errorMessage })

      // Continue to next provider
      continue
    }
  }

  // If we get here, both providers failed
  console.error("💥 All providers failed:", errors)

  // Create a detailed error message
  const errorDetails = errors.map((e) => `${e.provider}: ${e.error}`).join("; ")

  // Check if it's a configuration issue
  if (errors.every((e) => e.error.includes("not configured"))) {
    throw new Error("No AI providers are configured. Please set up API keys in the admin panel.")
  }

  throw new Error(`All AI providers failed. ${errorDetails}`)
}

// Enhanced design-specific generation function with quality checking
export async function generateDesignWithEnhancement(
  originalPrompt: string,
  designType: "logo" | "banner" | "poster" | "slogan" | "tagline" | "brandname",
  additionalContext?: any,
  systemPrompt?: string,
  preferredProvider: "openai" | "openrouter" = "openrouter",
  maxRetries = 2,
): Promise<{
  text: string
  usedProvider: string
  fallbackUsed: boolean
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

  // Map design types to task types for model selection
  const designToTaskMap: Record<typeof designType, TaskType> = {
    logo: "technical",
    banner: "visual",
    poster: "visual",
    slogan: "creative",
    tagline: "strategy",
    brandname: "creative",
  }

  const taskType = designToTaskMap[designType]
  let regenerationCount = 0

  // Generation loop with quality checking and regeneration
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const providers = preferredProvider === "openai" ? ["openai", "openrouter"] : ["openrouter", "openai"]
    const errors: { provider: string; error: string }[] = []

    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i]
      const isFirstChoice = i === 0

      try {
        console.log(
          `🔄 Attempting ${designType} generation with ${provider} (attempt ${attempt + 1}/${maxRetries + 1})...`,
        )

        let text: string
        let model: string | undefined

        if (provider === "openai") {
          text = await generateWithOpenAI(finalPrompt, systemPrompt)
          model = "gpt-4o"
        } else {
          const result = await generateWithOpenRouter(finalPrompt, taskType, systemPrompt, "premium")
          text = result.text
          model = result.model
        }

        console.log(`✅ Generated ${designType} using ${provider} ${model ? `(${model})` : ""}`)

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
            usedProvider: provider,
            fallbackUsed: !isFirstChoice,
            model,
            promptEnhanced,
            enhancedPrompt: finalPrompt,
            qualityAssessment,
            regenerationCount,
          }
        }

        // Quality check failed, try regeneration
        console.log(`⚠️ Quality check failed (score: ${qualityAssessment.score}/10), regenerating...`)
        regenerationCount++
        break // Break provider loop to retry with same provider
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.warn(`❌ ${provider} failed for ${designType}:`, errorMessage)

        errors.push({ provider, error: errorMessage })
        continue
      }
    }

    // If all providers failed for this attempt
    if (errors.length === providers.length) {
      console.error(`💥 All providers failed for ${designType} attempt ${attempt + 1}:`, errors)

      if (attempt >= maxRetries) {
        const errorDetails = errors.map((e) => `${e.provider}: ${e.error}`).join("; ")

        if (errors.every((e) => e.error.includes("not configured"))) {
          throw new Error("No AI providers are configured. Please set up API keys in the admin panel.")
        }

        throw new Error(`All AI providers failed for ${designType} after ${maxRetries + 1} attempts. ${errorDetails}`)
      }
    }
  }

  throw new Error(`Failed to generate acceptable ${designType} after ${maxRetries + 1} attempts`)
}

// SVG to other formats conversion utility
export async function convertSvgToFormats(svgContent: string): Promise<{
  svg: string
  png: string
  jpeg: string
}> {
  try {
    // For now, return the SVG and placeholder URLs for other formats
    // In a real implementation, you would use a service like Cloudinary or a server-side conversion
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString("base64")}`

    return {
      svg: svgContent,
      png: svgDataUrl, // Placeholder - would need server-side conversion
      jpeg: svgDataUrl, // Placeholder - would need server-side conversion
    }
  } catch (error) {
    console.error("❌ Format conversion failed:", error)
    return {
      svg: svgContent,
      png: svgContent,
      jpeg: svgContent,
    }
  }
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

// Enhanced image generation with design-focused enhancement
export async function generateImageWithFallback(
  originalPrompt: string,
  size = "1024x1024",
  designType: "logo" | "banner" | "poster" = "poster",
  additionalContext?: any,
): Promise<{
  imageUrl: string
  usedProvider: string
  fallbackUsed: boolean
  promptEnhanced: boolean
  isPlaceholder?: boolean
  description?: string
  enhancedPrompt?: string
}> {
  // Always enhance image prompts with design-focused enhancement
  const enhancement = await PromptEnhancer.enhancePromptToDesignDescription(
    originalPrompt,
    designType,
    additionalContext,
  )

  const finalPrompt = enhancement.enhancedPrompt
  const promptEnhanced = enhancement.enhancementUsed

  console.log(`🎨 Image prompt enhanced for ${designType}: ${promptEnhanced ? "Yes" : "No"}`)

  try {
    console.log("🔄 Attempting image generation with OpenAI...")
    const imageUrl = await generateImageWithOpenAI(finalPrompt, size)
    console.log("✅ Successfully generated image using OpenAI")
    return {
      imageUrl,
      usedProvider: "openai",
      fallbackUsed: false,
      promptEnhanced,
      enhancedPrompt: finalPrompt,
    }
  } catch (error) {
    console.error("❌ OpenAI image generation failed:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    // Check if it's a quota/billing error
    if (errorMessage.includes("QUOTA_EXCEEDED") || errorMessage.includes("quota") || errorMessage.includes("billing")) {
      console.log("💡 OpenAI quota exceeded, generating detailed description instead...")

      try {
        // Generate a detailed visual description using the enhanced prompt
        const systemPrompt = `You are a world-class visual designer and art director with expertise in ${designType} design. Create extremely detailed visual descriptions that could be used by a designer to recreate the design perfectly.`

        const result = await generateDesignWithEnhancement(
          originalPrompt,
          designType,
          additionalContext,
          systemPrompt,
          "openrouter",
        )

        const placeholderUrl = `/placeholder.svg?height=600&width=400&text=${encodeURIComponent(`AI-Generated ${designType.charAt(0).toUpperCase() + designType.slice(1)} Design`)}`

        return {
          imageUrl: placeholderUrl,
          usedProvider: result.usedProvider,
          fallbackUsed: true,
          promptEnhanced: true,
          isPlaceholder: true,
          description: result.text,
          enhancedPrompt: result.enhancedPrompt,
        }
      } catch (descriptionError) {
        console.error("❌ Description generation also failed:", descriptionError)

        const placeholderUrl = `/placeholder.svg?height=600&width=400&text=${encodeURIComponent("OpenAI quota exceeded - please check billing")}`
        return {
          imageUrl: placeholderUrl,
          usedProvider: "placeholder",
          fallbackUsed: true,
          promptEnhanced,
          isPlaceholder: true,
          description: "OpenAI image generation quota exceeded. Please check your billing settings.",
          enhancedPrompt: finalPrompt,
        }
      }
    }

    // For other errors, still try to generate a description
    try {
      console.log("💡 Image generation failed, creating visual description instead...")

      const systemPrompt = `You are a professional ${designType} designer. Create detailed visual descriptions for design concepts.`

      const result = await generateDesignWithEnhancement(
        originalPrompt,
        designType,
        additionalContext,
        systemPrompt,
        "openrouter",
      )

      const placeholderUrl = `/placeholder.svg?height=600&width=400&text=${encodeURIComponent(`${designType.charAt(0).toUpperCase() + designType.slice(1)} Design Concept`)}`

      return {
        imageUrl: placeholderUrl,
        usedProvider: result.usedProvider,
        fallbackUsed: true,
        promptEnhanced: true,
        isPlaceholder: true,
        description: result.text,
        enhancedPrompt: result.enhancedPrompt,
      }
    } catch (fallbackError) {
      console.error("❌ All image generation methods failed:", fallbackError)

      const placeholderUrl = `/placeholder.svg?height=600&width=400&text=${encodeURIComponent("Image generation temporarily unavailable")}`
      return {
        imageUrl: placeholderUrl,
        usedProvider: "placeholder",
        fallbackUsed: true,
        promptEnhanced,
        isPlaceholder: true,
        description: `Image generation failed: ${errorMessage}`,
        enhancedPrompt: finalPrompt,
      }
    }
  }
}

// Enhanced provider availability check
export async function checkProviderAvailability(): Promise<{
  openai: boolean
  openrouter: boolean
  hasAnyProvider: boolean
  diagnostics: {
    openai: string
    openrouter: string
  }
}> {
  try {
    const { openai_api_key, openrouter_api_key } = await getApiKeys()

    const openaiAvailable = !!openai_api_key && openai_api_key.trim().length > 0
    const openrouterAvailable = !!openrouter_api_key && openrouter_api_key.trim().length > 0

    const diagnostics = {
      openai: openaiAvailable ? `✅ Key configured (${openai_api_key.substring(0, 7)}...)` : "❌ No API key configured",
      openrouter: openrouterAvailable
        ? `✅ Key configured (${openrouter_api_key.substring(0, 7)}...)`
        : "❌ No API key configured",
    }

    // Additional validation for OpenRouter key format
    if (openrouterAvailable && !openrouter_api_key.startsWith("sk-or-")) {
      diagnostics.openrouter += " ⚠️ Key format may be incorrect (should start with 'sk-or-')"
    }

    console.log("🔍 Provider availability check:", diagnostics)

    return {
      openai: openaiAvailable,
      openrouter: openrouterAvailable,
      hasAnyProvider: openaiAvailable || openrouterAvailable,
      diagnostics,
    }
  } catch (error) {
    console.error("❌ Error checking provider availability:", error)
    return {
      openai: false,
      openrouter: false,
      hasAnyProvider: false,
      diagnostics: {
        openai: "❌ Error checking availability",
        openrouter: "❌ Error checking availability",
      },
    }
  }
}

// Test connection to OpenRouter with enhanced model testing
export async function testOpenRouterConnection(): Promise<{
  success: boolean
  error?: string
  availableModels?: string[]
}> {
  try {
    const { openrouter_api_key } = await getApiKeys()

    if (!openrouter_api_key) {
      return { success: false, error: "OpenRouter API key not configured" }
    }

    console.log("🔍 Testing OpenRouter connection...")

    const client = createOpenRouterClient(openrouter_api_key)

    // Test with a fast, reliable model
    const testModels = ["anthropic/claude-3-haiku", "openai/gpt-3.5-turbo", "meta-llama/llama-3.1-8b-instruct:free"]
    const availableModels: string[] = []

    for (const model of testModels) {
      try {
        const response = await client.chat.completions.create({
          model,
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 10,
          temperature: 0.1,
        })

        if (response.choices[0]?.message?.content) {
          availableModels.push(model)
          console.log(`✅ Model ${model} is available`)
        }
      } catch (modelError) {
        console.warn(`⚠️ Model ${model} not available:`, modelError)
      }
    }

    if (availableModels.length > 0) {
      return { success: true, availableModels }
    } else {
      return { success: false, error: "No models are available" }
    }
  } catch (error) {
    console.error("❌ OpenRouter connection test failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection test failed",
    }
  }
}

// Export the quality checker for external use
export { AIQualityChecker }
