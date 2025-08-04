import { supabaseAdmin } from "./supabase"

interface ApiKeys {
  openai_api_key: string
  flux_api_key: string
}

export async function getApiKeys(): Promise<ApiKeys> {
  try {
    // Check if Supabase is configured
    if (!supabaseAdmin) {
      console.warn("Supabase not configured - returning empty API keys")
      return {
        openai_api_key: "",
        flux_api_key: "",
      }
    }

    // Get API keys from Supabase secrets/vault
    const { data: openaiKey, error: openaiError } = await supabaseAdmin
      .from("secrets")
      .select("value")
      .eq("name", "openai_api_key")
      .single()

    const { data: fluxKey, error: fluxError } = await supabaseAdmin
      .from("secrets")
      .select("value")
      .eq("name", "flux_api_key")
      .single()

    // Log errors for debugging but don't throw immediately
    if (openaiError) {
      console.error("Error retrieving OpenAI API key:", openaiError)
    }

    if (fluxError) {
      console.error("Error retrieving FLUX API key:", fluxError)
    }

    return {
      openai_api_key: openaiKey?.value || "",
      flux_api_key: fluxKey?.value || "",
    }
  } catch (error) {
    console.error("Error fetching API keys:", error)
    // Return empty keys instead of throwing to allow graceful degradation
    return {
      openai_api_key: "",
    }
  }
}

export async function setApiKey(name: string, value: string): Promise<void> {
  try {
    // Check if Supabase is configured
    if (!supabaseAdmin) {
      throw new Error("Supabase not configured - cannot store API key")
    }

    const { error } = await supabaseAdmin.from("secrets").upsert({ name, value }, { onConflict: "name" })

    if (error) {
      throw new Error(`Failed to store API key: ${error.message}`)
    }
  } catch (error) {
    console.error("Error storing API key:", error)
    throw error
  }
}
