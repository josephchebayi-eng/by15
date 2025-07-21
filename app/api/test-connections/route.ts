import {
  generateWithFallback,
  generateImageWithFallback,
  checkProviderAvailability,
  testOpenRouterConnection,
} from "@/lib/ai-providers"

export async function GET() {
  try {
    console.log("🔍 Starting comprehensive AI connection test...")

    // Check provider availability
    const availability = await checkProviderAvailability()
    console.log("📊 Provider availability:", availability)

    // Test OpenRouter connection
    const openRouterTest = await testOpenRouterConnection()
    console.log("🔗 OpenRouter test:", openRouterTest)

    const testResults = {
      timestamp: new Date().toISOString(),
      availability,
      openRouterTest,
      moduleTests: {} as Record<string, any>,
    }

    // Test each AI module
    const modules = [
      { name: "logo", taskType: "technical" as const, prompt: "Create a simple tech company logo" },
      { name: "slogan", taskType: "creative" as const, prompt: "Create a slogan for TechCorp" },
      { name: "tagline", taskType: "strategy" as const, prompt: "Create a tagline for TechCorp" },
      { name: "brandname", taskType: "creative" as const, prompt: "Generate brand names for tech startup" },
      { name: "banner", taskType: "visual" as const, prompt: "Create a banner design description" },
      { name: "poster", taskType: "visual" as const, prompt: "Create a poster design description" },
    ]

    for (const module of modules) {
      try {
        console.log(`🧪 Testing ${module.name} module...`)

        const startTime = Date.now()
        const result = await generateWithFallback(
          module.prompt,
          `You are testing the ${module.name} generation system. Provide a brief test response.`,
          "openrouter", // Use OpenRouter since OpenAI quota is exceeded
          module.taskType,
          false, // Skip prompt enhancement for tests
        )
        const endTime = Date.now()

        testResults.moduleTests[module.name] = {
          status: "success",
          responseTime: endTime - startTime,
          provider: result.usedProvider,
          model: result.model,
          fallbackUsed: result.fallbackUsed,
          promptEnhanced: result.promptEnhanced,
          responseLength: result.text.length,
          preview: result.text.substring(0, 100) + "...",
        }

        console.log(`✅ ${module.name} module test successful`)
      } catch (error) {
        console.error(`❌ ${module.name} module test failed:`, error)
        testResults.moduleTests[module.name] = {
          status: "error",
          error: error instanceof Error ? error.message : String(error),
        }
      }
    }

    // Test image generation (will likely fail due to OpenAI quota, but test the fallback)
    try {
      console.log("🖼️ Testing image generation...")
      const imageResult = await generateImageWithFallback("A simple test image", "1024x1024", false)
      testResults.moduleTests["image"] = {
        status: "success",
        provider: imageResult.usedProvider,
        fallbackUsed: imageResult.fallbackUsed,
        promptEnhanced: imageResult.promptEnhanced,
      }
    } catch (error) {
      console.error("❌ Image generation test failed:", error)
      testResults.moduleTests["image"] = {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    const successCount = Object.values(testResults.moduleTests).filter((test) => test.status === "success").length
    const totalTests = Object.keys(testResults.moduleTests).length

    console.log(`🎯 Test Summary: ${successCount}/${totalTests} modules working`)

    return Response.json({
      success: true,
      summary: {
        totalTests,
        successCount,
        failureCount: totalTests - successCount,
        successRate: `${((successCount / totalTests) * 100).toFixed(1)}%`,
      },
      ...testResults,
    })
  } catch (error) {
    console.error("💥 Connection test failed:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Connection test failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
