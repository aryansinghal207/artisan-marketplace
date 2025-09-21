import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { productName, material, category, imageData } = await req.json()

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!apiKey) {
      // Fallback description when AI is not available
      const fallbackDescription = `🎨 **${productName}** - Handcrafted Excellence

Discover the beauty of authentic craftsmanship with this stunning ${productName.toLowerCase()}. Carefully crafted from premium ${material.toLowerCase()}, this piece represents the dedication and skill of local artisans who pour their heart into every creation.

Each piece tells a unique story of traditional techniques passed down through generations, combined with contemporary design sensibilities. The quality of ${material.toLowerCase()} ensures durability while maintaining the authentic handmade character that makes each item truly special.

Support local artisans and bring home a piece that's not just a product, but a work of art that celebrates human creativity and craftsmanship.

**Hashtags:** #HandmadeWithLove #LocalArtisan #${category.replace(/\s+/g, "")} #HandcraftedQuality #ArtisanMade #SupportLocal #UniqueDesign #TraditionalCraft #${material.replace(/\s+/g, "")}Art #HandmadeGifts #CraftedWithCare #ArtisanMarketplace #AuthenticCraft #MadeByHand #LocalCrafts

**Ready to add this unique piece to your collection? Order now and support local craftsmanship!**`

      return Response.json({ description: fallbackDescription })
    }

    let prompt = `Create a professional, engaging product description for an artisan marketplace. This will be used both on the website and for Instagram posts.

Product Details:
- Name: ${productName}
- Material: ${material}
- Category: ${category}

Requirements:
1. Write in an inspiring, authentic tone that celebrates craftsmanship
2. Highlight the unique handmade qualities
3. Include emotional appeal about supporting local artisans
4. Make it Instagram-ready with relevant hashtags
5. Keep it engaging but professional
6. Focus on quality, uniqueness, and the story behind the craft

Format the response with:
- A compelling product description (2-3 paragraphs)
- Relevant hashtags for Instagram (10-15 hashtags)
- A call-to-action that encourages purchase`

    // If image data is provided, include it in the analysis
    if (imageData) {
      prompt += `\n\nAdditionally, analyze this product image to enhance the description with visual details and craftsmanship elements you can observe.`
    }

    const { text } = await generateText({
      model: google("gemini-2.0-flash-exp"),
      prompt,
      maxOutputTokens: 1000,
      temperature: 0.7,
    })

    return Response.json({ description: text })
  } catch (error) {
    console.error("Error generating description:", error)

    const { productName, material, category } = await req.json()
    const fallbackDescription = `🎨 **${productName}** - Handcrafted Excellence

Discover the beauty of authentic craftsmanship with this stunning ${productName.toLowerCase()}. Carefully crafted from premium ${material.toLowerCase()}, this piece represents the dedication and skill of local artisans.

Each handmade item is unique and tells its own story of traditional techniques and contemporary design. The quality materials and attention to detail ensure you're getting a truly special piece.

**Hashtags:** #HandmadeWithLove #LocalArtisan #${category.replace(/\s+/g, "")} #HandcraftedQuality #ArtisanMade #SupportLocal #UniqueDesign #${material.replace(/\s+/g, "")}Art #HandmadeGifts #CraftedWithCare

**Ready to add this unique piece to your collection? Order now!**`

    return Response.json({ description: fallbackDescription })
  }
}
