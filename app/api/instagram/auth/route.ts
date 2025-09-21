export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")

    if (!code) {
      // Redirect to Instagram OAuth
      const clientId = process.env.INSTAGRAM_CLIENT_ID
      const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/instagram/auth`

      if (!clientId) {
        return Response.json({ error: "Instagram client ID not configured" }, { status: 500 })
      }

      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`

      return Response.redirect(authUrl)
    }

    // Exchange code for access token
    const clientId = process.env.INSTAGRAM_CLIENT_ID
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/instagram/auth`

    if (!clientId || !clientSecret) {
      return Response.json({ error: "Instagram credentials not configured" }, { status: 500 })
    }

    const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code: code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.access_token) {
      // Exchange short-lived token for long-lived token
      const longLivedResponse = await fetch(
        `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${tokenData.access_token}`,
      )

      const longLivedData = await longLivedResponse.json()

      // Redirect back to profile settings with token
      const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/profile?token=${longLivedData.access_token}&user_id=${tokenData.user_id}`
      return Response.redirect(redirectUrl)
    }

    throw new Error("Failed to get access token")
  } catch (error) {
    console.error("[v0] Instagram auth error:", error)
    return Response.json(
      {
        error: "Instagram authentication failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
