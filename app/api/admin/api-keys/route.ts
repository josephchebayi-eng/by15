import { setApiKey, getApiKeys } from "@/lib/api-keys"

export async function POST(req: Request) {
  try {
    const { name, value } = await req.json()

    if (!name || !value) {
      return Response.json({ success: false, error: "Name and value are required" }, { status: 400 })
    }

    await setApiKey(name, value)

    return Response.json({
      success: true,
      message: "API key stored successfully",
    })
  } catch (error) {
    console.error("API key storage error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to store API key",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const keys = await getApiKeys()

    // Return masked keys for security
    return Response.json({
      success: true,
      keys: {
        openai_configured: !!keys.openai_api_key,
        flux_configured: !!keys.flux_api_key,
      },
    })
  } catch (error) {
    console.error("API key retrieval error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to retrieve API keys",
      },
      { status: 500 },
    )
  }
}
