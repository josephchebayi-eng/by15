"use client"

import React, { useState } from "react"

export default function LogoGenerator() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("")
  const [colors, setColors] = useState("")
  const [industry, setIndustry] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const generateLogo = async () => {
    setLoading(true)
    setError("")
    setImageUrl("")

    try {
      const res = await fetch("/api/generate/logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, colors, industry }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.")
      }

      setImageUrl(data.imageUrl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Logo Generator</h1>

      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block font-medium">Business Description</label>
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. A bakery that sells organic cakes"
          />
        </div>

        <div>
          <label htmlFor="style" className="block font-medium">Style</label>
          <input
            id="style"
            type="text"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. modern, playful"
          />
        </div>

        <div>
          <label htmlFor="colors" className="block font-medium">Colors</label>
          <input
            id="colors"
            type="text"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. pink and white"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block font-medium">Industry</label>
          <input
            id="industry"
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. bakery, tech, fashion"
          />
        </div>

        <button
          onClick={generateLogo}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Generating..." : "Generate Logo"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {imageUrl && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Generated Logo:</h2>
          <img
            src={imageUrl}
            alt="Generated Logo"
            className="border border-gray-200 rounded shadow"
          />
        </div>
      )}
    </div>
  )
}
