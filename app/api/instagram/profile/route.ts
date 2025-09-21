export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const accessToken = searchParams.get("accessToken")

    if (!accessToken) {
      return Response.json({ error: "Access token required" }, { status: 400 })
    }

    console.log("[v0] Fetching Instagram profile data")

    // Get user profile information
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`,
    )

    if (!profileResponse.ok) {
      throw new Error("Failed to fetch profile data")
    }

    const profileData = await profileResponse.json()

    // Get recent media
    const mediaResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${accessToken}`,
    )

    const mediaData = await mediaResponse.json()

    console.log("[v0] Instagram profile data fetched successfully")

    return Response.json({
      success: true,
      profile: profileData,
      recentPosts: mediaData.data || [],
      connected: true,
    })
  } catch (error) {
    console.error("[v0] Error fetching Instagram profile:", error)
    return Response.json(
      {
        error: "Failed to fetch Instagram profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
