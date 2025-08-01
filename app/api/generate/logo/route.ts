import { NextResponse } from "next/server"
import OpenAI from "openai"

// Import the configured Supabase client
import { supabaseAdmin } from "@/lib/supabase"

// ✅ Simplified debug - try without .single() first
async function getOpenAIKey(): Promise<string | null> {
  console.log("🔍 Starting getOpenAIKey function...")
  
  try {
    // Check if Supabase is configured
    if (!supabaseAdmin) {
      console.log("❌ Supabase not configured")
      return null
    }

    // Try to get ALL rows first (no .single())
    const { data: allRows, error: allError } = await supabaseAdmin
      .from("secrets")
      .select("*")

    console.log("📋 Query result:", {
      data: allRows,
      error: allError,
      rowCount: allRows?.length || 0
    })

    if (allError) {
      console.error("❌ Error querying secrets table:", allError)
      return null
    }

    if (!allRows || allRows.length === 0) {
      console.log("❌ No rows found in secrets table")
      return null
    }

    // Look for OpenAI key in different possible name formats
    const possibleNames = ['openai_api_key', 'openai', 'OPENAI_API_KEY', 'OpenAI_API_Key']
    
    for (const name of possibleNames) {
      const found = allRows.find(row => row.name === name)
      if (found && found.value) {
        console.log(`✅ Found OpenAI key with name: "${name}"`)
        console.log(`✅ Key length: ${found.value.length}`)
        return found.value
      }
    }

    console.log("❌ No OpenAI key found. Available names:", 
      allRows.map(row => `"${row.name}"`).join(', '))
    
    return null

  } catch (err) {
    console.error("❌ Catch block error:", err)
    return null
  }
}

// ✅ Properly typed request interface
interface LogoRequest {
  prompt: string
  style?: string
  colors?: string
  industry?: string
}

export async function POST(req: Request) {
  try {
    const { prompt, style, colors, industry }: LogoRequest = await req.json()

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" }, 
        { status: 400 }
      )
    }

    const apiKey = await getOpenAIKey()
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI API key not found in Supabase.",
          needsConfiguration: true,
        },
        { status: 503 }
      )
    }

    const openai = new OpenAI({ apiKey })

    const fullPrompt = `
Design a modern, vibrant, colorful logo for a business in the ${industry || "creative"} industry.
Style: ${style || "artistic, bold"}
Colors: ${colors || "vivid and eye-catching"}
Business description: ${prompt}
The logo should be professional, scalable, and look great on websites, merchandise, and social media.
`

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: fullPrompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    })

    const imageUrl = response.data?.[0]?.url

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "No image was generated by OpenAI." },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt: fullPrompt,
      provider: "openai",
      model: "dall-e-3",
      message: "Logo image generated using DALL·E 3",
    })
  } catch (error: unknown) {
    console.error("❌ Logo generation error:", error)
    const errorMessage = error instanceof Error ? error.message : "Image generation failed."
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}