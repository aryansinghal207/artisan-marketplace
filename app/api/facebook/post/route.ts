export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { accessToken, pageId, message, imageUrl, pageAccessToken } = body

    if (!accessToken || !pageId || !message) {
      return Response.json({ 
        error: "Access token, page ID, and message are required" 
      }, { status: 400 })
    }

    console.log("[Facebook] Posting to page:", pageId)

    // Use page access token if provided, otherwise use user access token
    const tokenToUse = pageAccessToken || accessToken

    // Prepare post data
    const postData = new URLSearchParams({
      message: message,
      access_token: tokenToUse
    })

    // Add image if provided
    if (imageUrl) {
      postData.append('picture', imageUrl)
    }

    // Post to Facebook page
    const postResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/feed`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: postData
      }
    )

    const postResult = await postResponse.json()

    if (postResult.error) {
      console.error("[Facebook] Post error:", postResult.error)
      return Response.json({ 
        error: postResult.error.message 
      }, { status: 400 })
    }

    console.log("[Facebook] Post created successfully:", postResult.id)

    return Response.json({
      success: true,
      postId: postResult.id,
      message: "Posted to Facebook successfully!"
    })

  } catch (error) {
    console.error("[Facebook] Error posting:", error)
    return Response.json(
      {
        error: "Failed to post to Facebook",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}