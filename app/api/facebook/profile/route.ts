export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const accessToken = searchParams.get("accessToken")

    if (!accessToken) {
      return Response.json({ error: "Access token required" }, { status: 400 })
    }

    console.log("[Facebook] Fetching profile data")

    // Get user profile information with basic fields
    const profileResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture.width(200).height(200)&access_token=${accessToken}`
    )

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text()
      console.error("[Facebook] Profile fetch error:", errorText)
      throw new Error("Failed to fetch profile data")
    }

    const profileData = await profileResponse.json()

    // Initialize empty arrays for pages and posts
    let pagesData = { data: [] }
    let postsData = { data: [] }

    // Try to get user's pages (this may fail if permission not granted)
    try {
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token,category&access_token=${accessToken}`
      )

      if (pagesResponse.ok) {
        pagesData = await pagesResponse.json()
      } else {
        console.warn("[Facebook] Pages access not available - requires app review")
      }
    } catch (pagesError) {
      console.warn("[Facebook] Pages fetch failed:", pagesError)
    }

    // Try to get recent posts (this may fail if permission not granted)
    try {
      const postsResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/posts?fields=id,message,created_time,picture,permalink_url&limit=12&access_token=${accessToken}`
      )

      if (postsResponse.ok) {
        postsData = await postsResponse.json()
      } else {
        console.warn("[Facebook] Posts access not available - requires app review")
      }
    } catch (postsError) {
      console.warn("[Facebook] Posts fetch failed:", postsError)
    }

    console.log("[Facebook] Profile data fetched successfully")

    return Response.json({
      success: true,
      profile: profileData,
      pages: pagesData.data || [],
      recentPosts: postsData.data || [],
      connected: true,
    })
  } catch (error) {
    console.error("[Facebook] Error fetching profile:", error)
    return Response.json(
      {
        error: "Failed to fetch Facebook profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}